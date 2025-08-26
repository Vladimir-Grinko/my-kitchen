"use client";

import { siteConfig } from "@/config/site.config";
import { usePathname } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";

const PageContent = () => {
  const pathName = usePathname();

  const pageContent =
    siteConfig.pagesContent[pathName as keyof typeof siteConfig.pagesContent];

  if (!pageContent) {
    return <div>Страница не найдена</div>;
  }

  const cleanHTML = DOMPurify.sanitize(pageContent.content);

  return <div>{parse(cleanHTML)}</div>;
};

export default PageContent;
