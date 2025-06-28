import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MessageSquare } from "lucide-react";

export default function News() {
  const newsArticles = [
    {
      id: 1,
      title: "Welcome to NoMercy Gaming Platform!",
      summary: "Our new gaming platform is now live with exciting casino games and squad features.",
      author: "Admin",
      date: "2024-01-01",
      category: "Announcement",
      comments: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <h1 className="text-2xl font-bold text-slate-50 mb-6">Squad News</h1>
          
          <div className="space-y-6">
            {newsArticles.map((article) => (
              <Card key={article.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-slate-50 mb-2">{article.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{article.comments} comments</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-500 text-white">
                      {article.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{article.summary}</p>
                </CardContent>
              </Card>
            ))}
            
            {newsArticles.length === 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-50 mb-2">No news yet</h3>
                  <p className="text-slate-400">Check back later for squad updates and announcements.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
