// components/PreviewProvider.tsx
import React from "react";

export default function PreviewProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// app/[slug]/PreviewPostPage.tsx
import PostPage from "./PostPage";

export default PostPage;
