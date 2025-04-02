
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with AI Automation",
      excerpt: "Learn the basics of AI automation and how to implement it in your business...",
      date: "June 15, 2023",
      category: "Beginners",
    },
    {
      id: 2,
      title: "5 Ways AI Can Streamline Your Customer Service",
      excerpt: "Discover how AI can transform your customer service operations and improve satisfaction...",
      date: "July 3, 2023",
      category: "Customer Service",
    },
    {
      id: 3,
      title: "The Future of AI in Business Operations",
      excerpt: "Explore upcoming trends in AI automation and how they will shape business operations...",
      date: "August 12, 2023",
      category: "Future Trends",
    },
    {
      id: 4,
      title: "Measuring ROI on Your AI Investments",
      excerpt: "Learn how to calculate and maximize the return on your AI automation investments...",
      date: "September 5, 2023",
      category: "Business",
    },
  ];

  return (
    <div className="container max-w-screen-xl py-12">
      <h1 className="text-3xl font-bold mb-2">AI Automation Blog</h1>
      <p className="text-muted-foreground mb-8">
        Insights, tips, and trends in AI automation to help you implement intelligent solutions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <Link to={`/blog/${post.id}`}>
              <div className="h-48 bg-querify-gray flex items-center justify-center">
                <div className="text-3xl font-bold text-querify-blue">QuerifyAI</div>
              </div>
            </Link>
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-querify-blue font-medium px-2 py-1 bg-blue-50 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <Link to={`/blog/${post.id}`}>
                <CardTitle className="text-xl hover:text-querify-blue transition-colors">
                  {post.title}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-muted-foreground">{post.excerpt}</p>
              <Link 
                to={`/blog/${post.id}`} 
                className="mt-4 inline-flex items-center text-querify-blue hover:underline"
              >
                Read more
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
