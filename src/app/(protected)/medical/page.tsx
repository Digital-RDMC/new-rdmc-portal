"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Building, Stethoscope } from "lucide-react";
import LoadingPage from "@/components/LoadingPage"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface MedicalProvider {
  dr_code: number;
  grade_5: boolean;
  dr_name_ar: string;
  provider_type_ar: string;
  services_provided_ar: string;
  specialty_ar: string;
  address_ar: string;
  area_ar: string;
  governate_ar: string;
  tel: string;
  email: string;
  governate: string;
  area: string;
  address: string;
  specialty: string;
  services_provided: string;
  provider_type: string;
  dr_name: string;
  provider_key: string;
  external_ref: string;
  network_type: string;
  branch: string;
  re_new: string;
  pluse_status: string;
  year: string;
  month: string;
}

export default function MedicalPage() {
  const userContext = useUser();
  const [medicalData, setMedicalData] = useState<MedicalProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords] = useState(4400); // Total records available
  const itemsPerPage = 50; // Number of items per page
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; // This gets the current language
  const isArabic = currentLanguage === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const newOffset = (currentPage - 1) * itemsPerPage;
        
        const response = await fetch("https://n8n.srv869586.hstgr.cloud/webhook/medical", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userContext.vtoken || ''}`,
          },
          body: JSON.stringify({ offset: newOffset, limit: itemsPerPage }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch medical data");
        }

        const data = await response.json();
        console.log("Medical data fetched:", data); // Log the fetched data for debugging
        setMedicalData(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch medical data:", err);
      } finally {
 const startTime = Date.now();
          const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      // Wait for the remaining time before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);

      }
    };

    if (userContext.userData) {
      fetchData();
    }
  }, [userContext.userData, currentPage, itemsPerPage]);

  // Pagination navigation functions
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and surrounding pages
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {


    return (

         <div className=" mx-auto">
                <LoadingPage title="Loading medical list..." removeHeader={true} removeLogo={true} />
              </div>
    //   <div className="flex items-center justify-center min-h-[400px]">
    //     <div className="text-center">
    //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    //       <p className="mt-4 text-gray-600">{t('loading')}...</p>
    //     </div>
    //   </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
        
        {/* <MedicalFilter /> */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isArabic ? 'الخدمات الطبية' : 'Medical Services'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {isArabic 
            ? `العثور على ${medicalData.length} من أصل ${totalRecords} مقدم خدمة طبية (الصفحة ${currentPage} من ${totalPages})` 
            : `Showing ${medicalData.length} of ${totalRecords} medical providers (Page ${currentPage} of ${totalPages})`
          }
        </p>
      </div>
<div className="w-full max-w-xl mx-auto">
             <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handlePrevious();
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {/* Show first page if not in visible range */}
        {getPageNumbers()[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {getPageNumbers()[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        
        {/* Render visible page numbers */}
        {getPageNumbers().map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink 
              href="#" 
              isActive={pageNum === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNum);
              }}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {/* Show last page if not in visible range */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {medicalData.map((provider) => (
          <Card key={provider.dr_code} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    <div className="flex items-center gap-2">
                      {(isArabic ? provider.dr_name_ar?.trim() : provider.dr_name)?.slice(0, 22)}
                      {((isArabic ? provider.dr_name_ar?.trim() : provider.dr_name)?.length ?? 0) > 22 ? '…' : ''}
                    </div>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      {isArabic ? provider.specialty_ar : provider.specialty}
                    </div>
                  </CardDescription>
                </div>
                
                {/* <div className="flex flex-col gap-1">
                 
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(provider.pluse_status)} text-white text-xs`}
                  >
                    {provider.pluse_status || 'Unknown'}
                  </Badge>
                </div> */}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Provider Type */}
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isArabic ? provider.provider_type_ar : provider.provider_type}
                </span>
              </div>

              {/* Services */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {isArabic ? 'الخدمات:' : 'Services:'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isArabic ? provider.services_provided_ar : provider.services_provided}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {isArabic ? 'الموقع:' : 'Location:'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p>{isArabic ? provider.address_ar : provider.address}</p>
                  <p>
                    {isArabic ? provider.area_ar : provider.area} - {isArabic ? provider.governate_ar : provider.governate}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {provider.tel && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-cyan-800" />
                    <a 
                      href={`tel:${provider.tel}`}
                      className="text-sm text-cyan-800 hover:text-cyan-900 transition-colors"
                    >
                      {provider.tel}
                    </a>
                  </div>
                )}
                
                {provider.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-500" />
                    <a 
                      href={`mailto:${provider.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors truncate"
                    >
                      {provider.email}
                    </a>
                  </div>
                )}
              </div>

             
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Pagination */}
      {medicalData.length > 0 && (
        <div className="w-full max-w-xl mx-auto mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePrevious();
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {/* Show first page if not in visible range */}
              {getPageNumbers()[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {getPageNumbers()[0] > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              
              {/* Render visible page numbers */}
              {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    href="#" 
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {/* Show last page if not in visible range */}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {medicalData.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏥</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isArabic ? 'لا توجد خدمات طبية متاحة' : 'No medical services available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {isArabic 
              ? 'يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني' 
              : 'Please try again later or contact support'
            }
          </p>
        </div>
      )}
    </div>
  );
}
