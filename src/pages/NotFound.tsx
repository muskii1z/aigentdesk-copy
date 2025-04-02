
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container max-w-screen-xl py-24 text-center">
      <h1 className="text-6xl font-bold text-querify-blue mb-6">404</h1>
      <p className="text-2xl font-semibold mb-4">Oops! Page not found</p>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="bg-querify-blue hover:bg-querify-lightBlue">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
