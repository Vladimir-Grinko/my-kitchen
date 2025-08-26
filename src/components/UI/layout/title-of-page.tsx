"use client";

import { siteConfig } from "@/config/site.config";
import { usePathname } from "next/navigation";

const TitleOfPage = () => {
  const pathName = usePathname();

  const currentNavItem = siteConfig.navItems.find(
    (item) => item.href === pathName
  );

  const pageTitle = currentNavItem ? currentNavItem.label : siteConfig.title;
  return (
    <div className="w-full flex justify-center my-6">
      <h1 className="text-3xl font-bold">{pageTitle}</h1>
    </div>
  );
};

export default TitleOfPage;
