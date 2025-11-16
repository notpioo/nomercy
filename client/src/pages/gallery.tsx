import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Media } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@/contexts/AuthContext";
import { queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Gallery() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const { data: media, isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
    queryFn: async () => {
      const q = query(collection(db, "media"), orderBy("uploadedAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Media);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !currentUser) {
        throw new Error("No file selected or user not logged in");
      }

      const { url, publicId } = await uploadToCloudinary(selectedFile);

      const mediaData = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        cloudinaryUrl: url,
        cloudinaryPublicId: publicId,
        caption: caption || "",
        uploadedAt: Date.now(),
        tags: [],
      };

      await addDoc(collection(db, "media"), mediaData);

      await addDoc(collection(db, "activities"), {
        id: `${currentUser.uid}-${Date.now()}`,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        type: "upload",
        description: `${currentUser.displayName} uploaded a new image`,
        timestamp: Date.now(),
      });

      return mediaData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded to the gallery.",
      });
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    uploadMutation.mutate();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Community Gallery
          </h1>
          <p className="text-muted-foreground">
            {media?.length || 0} epic gaming moments shared
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Share your epic gaming moment with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-md"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      data-testid="button-remove-preview"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer text-primary font-medium hover:underline"
                    >
                      Choose an image
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-file"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption (optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="Add a caption to your image..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  data-testid="input-caption"
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="w-full"
                data-testid="button-submit-upload"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload to Gallery"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-64 w-full rounded-t-md" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : media && media.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <Card key={item.id} className="hover-elevate overflow-hidden" data-testid={`media-${item.id}`}>
              <img
                src={item.cloudinaryUrl}
                alt={item.caption || "Gaming moment"}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                {item.caption && (
                  <p className="text-sm text-foreground mb-2">{item.caption}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Shared by {item.userName}</span>
                  <span>•</span>
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No images uploaded yet</p>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Image
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
