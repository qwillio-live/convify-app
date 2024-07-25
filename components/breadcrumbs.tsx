import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "./ui/button";

const extractFlowIdFromUrl = (currentPath) => {
  const url = currentPath;
  const matchShare = url && url.match(/dashboard\/([^\/]+)\/share/);
  const matchConnect = url && url.match(/dashboard\/([^\/]+)\/connect/);
  const matchResult = url && url.match(/dashboard\/([^\/]+)\/results/);

  if (matchShare && matchShare[1] && matchShare[1] !== "flows") {
    return matchShare[1];
  } else if (matchConnect && matchConnect[1] && matchConnect[1] !== "flows") {
    return matchConnect[1];
  } else if (matchResult && matchResult[1] && matchResult[1] !== "flows") {
    return matchResult[1];
  }
  return null;
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export function BreadCrumbs() {
  const t = useTranslations("CreateFlow");
  const currentPath = usePathname();

  const flowId = useMemo(() => extractFlowIdFromUrl(currentPath), [currentPath]);
  const [loading, setLoading] = useState<boolean>(false);
  const [flowName, setFlowName] = useState<string | null>(() => {
    if (flowId) {
      const storedFlowName = localStorage.getItem(`flowName_${flowId}`);
      if (storedFlowName) {
        return storedFlowName;
      }
    }
    return null;
  });
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 768);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(window.innerWidth <= 370);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      setIsVerySmallScreen(window.innerWidth <= 370);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (flowId && !flowName) {
      setLoading(true);
      fetch(`/api/flows/${flowId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          setFlowName(data.name);
          localStorage.setItem(`flowName_${flowId}`, data.name);
        })
        .catch((error) => {
          console.error("There has been a problem with your fetch operation:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [flowId, flowName]);

  // Inline styles for truncation
  const truncateStyle = {
    display: 'inline-block',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const smallScreenTruncateStyle = {
    ...truncateStyle,
    maxWidth: '150px', // Adjust the width as needed
  };

  const verySmallScreenStyle = {
    fontSize: '13px',
    ...smallScreenTruncateStyle,
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <span className="hidden lg:inline-block">{t("My workspace")}</span>
            <Button
              className="lg:hidden p-0 size-8 max-h-8"
              size="sm"
              variant="outline"
            >
              <ChevronLeft />
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden lg:inline-block">/</BreadcrumbSeparator>
        <BreadcrumbItem className="max-lg:ml-3.5">
          <BreadcrumbPage
            style={isVerySmallScreen ? verySmallScreenStyle : isSmallScreen ? smallScreenTruncateStyle : truncateStyle}
          >
            {loading ? "..." : flowName ? isVerySmallScreen ? truncateText(flowName, 8) : isSmallScreen ? truncateText(flowName, 12) : truncateText(flowName, 50) : t("My new form")}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
