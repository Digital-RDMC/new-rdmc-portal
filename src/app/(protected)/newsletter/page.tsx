"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import LoadingPage from "@/components/LoadingPage"


interface Comment {
    id: number;
    comment: string;
    created_at: string;
    created_by: string;
    employee_position: string;
    employee_last_name: string;
    employee_first_name: string;
    employee_last_name_ar: string;
    employee_first_name_ar: string;
    employee_photo: string;
}

interface Like {
    created_at: string;
    created_by: string;
    employee_position: string;
    employee_last_name: string;
    employee_first_name: string;
    employee_last_name_ar: string;
    employee_first_name_ar: string;
    employee_photo: string;
}

interface NewsItem {
    created_at: string;
    title_en: string;
    title_ar: string;
    title_fr: string;
    short_en: string | null;
    short_ar: string | null;
    short_fr: string | null;
    des_en: string;
    des_ar: string;
    des_fr: string;
    image_en: string | null;
    image_ar: string | null;
    image_fr: string | null;
    ref: string | null;
    release_date: string;
    type: 'birth wishes' | 'anniversary' | 'event';
    related_emp: string | null;
    comments?: Comment[];
    likes?: Like[];
}


export default function News() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language; // This gets the current language
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());
  const [showLikes, setShowLikes] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState<{[key: number]: string}>({});
  const likesDropdownRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  

  // Function to get the title based on current language
  const getTitle = (item: NewsItem) => {
    switch (currentLanguage) {
      case 'ar':
        return item.title_ar || item.title_en || 'No title';
      case 'fr':
        return item.title_fr || item.title_en || 'No title';
      case 'en':
      default:
        return item.title_en || 'No title';
    }
  };

  
  // Function to get the description based on current language
  const getDescription = (item: NewsItem) => {
    switch (currentLanguage) {
      case 'ar':
        return item.des_ar || item.des_en || 'No description';
      case 'fr':
        return item.des_fr || item.des_en || 'No description';
      case 'en':
      default:
        return item.des_en || 'No description';
    }
  };

  // Function to get the short description based on current language
  const getShortDescription = (item: NewsItem) => {
    switch (currentLanguage) {
      case 'ar':
        return item.short_ar || item.short_en || null;
      case 'fr':
        return item.short_fr || item.short_en || null;
      case 'en':
      default:
        return item.short_en || null;
    }
  };

  

  // const getImageSrc = (item: NewsItem) => {
  //   switch (currentLanguage) {
  //     case 'ar':
  //       return item.image_ar || item.image_en || null;
  //     case 'fr':
  //       return item.image_fr || item.image_en || null;
  //     case 'en':
  //     default:
  //       return item.image_en || null;
  //   }
  // };

  // Function to toggle expanded state for a specific item
  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Function to toggle comments visibility
  const toggleComments = (index: number) => {
    setShowComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Function to toggle likes dropdown visibility
  const toggleLikes = (index: number) => {
    setShowLikes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Function to handle comment submission
  const handleCommentSubmit = (newsIndex: number) => {
    const comment = newComment[newsIndex]?.trim();
    if (!comment) return;

    // Here you would typically make an API call to post the comment
    console.log('Submitting comment:', comment, 'for news item:', newsIndex);
    
    // Clear the comment input
    setNewComment(prev => ({
      ...prev,
      [newsIndex]: ''
    }));
  };

  // Function to handle like/unlike
  const handleLike = (newsIndex: number) => {
    // Here you would typically make an API call to like/unlike the post
    console.log('Toggling like for news item:', newsIndex);
    
    // For now, we'll just log it. In a real implementation, you would:
    // 1. Call an API to like/unlike the post
    // 2. Update the local state to reflect the change
    // 3. Refresh the news data or update the likes array
  };

  // Function to get employee display name
  const getEmployeeName = (comment: Comment | Like) => {
    switch (currentLanguage) {
      case 'ar':
        return `${comment.employee_first_name_ar} ${comment.employee_last_name_ar}`;
      case 'fr':
      case 'en':
      default:
        return `${comment.employee_first_name} ${comment.employee_last_name}`;
    }
  };


  const getEmployeePhoto = (comment: Comment | Like) => {
    console.log('Employee photo:', comment.employee_photo);
    return comment.employee_photo || null;
  };

  useEffect(() => {

    
      const vtoken = document.cookie
        .split('; ')
        .find(row => row.startsWith('vtoken='))
        ?.split('=')[1];


    fetch('/api/news', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vtoken }),
    })
      .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return response.json();
      })
      .then(data => {
     
        // Ensure data is an array
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.error('Expected array but got:', typeof data);
          setError('Invalid data format received');
        }
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setError(err.message);
      })
      .finally(() => {
        const startTime = Date.now();
          const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      // Wait for the remaining time before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);



      });
  }, []);

  // Close likes dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as Element;
      
      // Check if click is outside any likes dropdown
      const isOutside = Object.values(likesDropdownRefs.current).every(ref => 
        !ref?.contains(clickedElement)
      );
      
      if (isOutside) {
        setShowLikes(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className=" mx-auto">
        <LoadingPage title="Loading news..." removeHeader={true} removeLogo={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className=" mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">News</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className=" w-full max-w-xl mx-auto p-6">
      {/* <h1 className="text-3xl font-bold mb-6">News</h1>
      <p>This is the news component. Current language: {currentLanguage}</p> */}
      {news.length > 0 ? (
        <div className="space-y-6">
          {news.map((item, index) => (
            <div key={item.title_en || index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-visible relative">
              {/* Header section - like Facebook post header */}
              <div className="flex items-center p-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center me-3">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">RDMC Portal</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>
                      {new Date(item.release_date).toLocaleDateString(currentLanguage, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="mx-1">·</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 3.314-2.686 6-6 6s-6-2.686-6-6a4.75 4.75 0 01.332-1.973z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              </div>

              {/* Content section */}
              <div className="p-4 flex flex-row gap-4 relative">



                <div className="">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-tight flex flex-row justify-start items-center gap-0">
                
                {
                  item.related_emp && item.related_emp !== 'null' ? (
                    <div className="me-3">
                      <Image src={`https://photos.rdmc-portal.com/Photo_ID/${item.related_emp}.jpg`} alt={''} width={500} height={500} className="h-auto w-24 object-cover z-50 rounded-lg" />
                    </div>
                  ) : null}
                  <span> {getTitle(item)}</span>
                </h2>

                {getShortDescription(item) && (
                  <div className="mb-4">
                    
                    {!expandedItems.has(index) ? (
                      // Show short description with "See more" button
                      <div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                          {getShortDescription(item)}
                        </p>
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          See more
                        </button>
                      </div>
                    ) : (
                      // Show full description with "See less" button
                      <div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                          {getDescription(item)}
                        </p>
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          See less
                        </button>
                      </div>
                    )}

                    
                  </div>
                )}

                {/* If there's no short description, just show the full description */}
                {!getShortDescription(item) && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                    {getDescription(item)}
                  </p>
                )}


</div>

    





              </div>

              {/* Image section */}
              {/* {getImageSrc(item) && ( */}
                {/* <div className="relative">
                 
                  <Image
                    // src={getImageSrc(item) as string}
                    src="/images/birthday_wishes/1.jpg"
                    width={600}
                    height={400}
                    alt={getTitle(item)}
                    className="w-full h-60 object-cover"
                  />
              


                </div> */}
              {/* )} */}

              {/* Interaction section - like Facebook post interactions */}
              <div className="border-t border-gray-100">
                {/* Likes and comments count */}
                {((item.likes?.length || 0) > 0 || (item.comments?.length || 0) > 0) && (
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-50 relative overflow-visible">
                    <div className="flex justify-between">
                      {(item.likes?.length || 0) > 0 && (
                        <button 
                          className="hover:underline cursor-pointer flex items-center space-x-1"
                          onClick={() => toggleLikes(index)}
                        >
                          <span className="text-blue-600">👍</span>
                          <span>{item.likes?.length} {(item.likes?.length || 0) === 1 ? 'like' : 'likes'}</span>
                        </button>
                      )}
                      {(item.comments?.length || 0) > 0 && (
                        <span 
                          className="cursor-pointer hover:underline"
                          onClick={() => toggleComments(index)}
                        >
                          {item.comments?.length} {(item.comments?.length || 0) === 1 ? 'comment' : 'comments'}
                        </span>
                      )}
                    </div>

                    {/* Likes dropdown */}
                    {showLikes.has(index) && (item.likes?.length || 0) > 0 && (
                      <div 
                        ref={(el) => { likesDropdownRefs.current[index] = el; }}
                        className="absolute top-full left-4 bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-64 max-w-80 z-[9999]"
                        style={{
                          marginTop: '8px'
                        }}
                      >
                        <div className="text-sm font-semibold text-gray-900 mb-2">
                          People who liked this
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {(item.likes || []).map((like, likeIndex) => (
                            <div key={`${like.created_by}-${likeIndex}`} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                                {getEmployeePhoto(like) ? (
                                  <Image
                                    src={getEmployeePhoto(like) as string}
                                    alt={getEmployeeName(like)}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">
                                  {getEmployeeName(like)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {like.employee_position}
                                </div>
                              </div>
                              <div className="text-blue-600 ml-2">
                                👍
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-between p-3 text-gray-500 text-sm">
                  <div className="flex items-center space-x-6 w-full">
                    <button 
                      className={`flex items-center space-x-2 hover:text-blue-600 transition-colors flex-1 justify-center py-2 ${
                        (item.likes || []).some(like => like.created_by === 'RDMC0187') // Replace with actual user ID
                          ? 'text-blue-600 font-semibold' 
                          : ''
                      }`}
                      onClick={() => handleLike(index)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Like</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors flex-1 justify-center py-2"
                      onClick={() => toggleComments(index)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors flex-1 justify-center py-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments section */}
                {showComments.has(index) && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {/* Existing comments */}
                    {(item.comments?.length || 0) > 0 && (
                      <div className="max-h-64 overflow-y-auto">
                        {(item.comments || []).map((comment) => (
                          <div key={comment.id} className="flex p-3 border-b border-gray-100 last:border-b-0">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                             {getEmployeePhoto(comment) ? (
                               
                                <Image
                                  src={getEmployeePhoto(comment) as string}
                                  alt={getEmployeeName(comment)}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ):(
                                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                              )}
                            
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-lg px-3 py-2">
                                <div className="font-semibold text-sm text-gray-900">
                                  {getEmployeeName(comment)}
                                </div>
                                <div className="text-sm text-gray-700 mt-1">
                                  {comment.comment}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 ml-3">
                                {new Date(comment.created_at).toLocaleDateString(currentLanguage, {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new comment */}
                    <div className="flex p-3 bg-white border-t border-gray-200">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 flex">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComment[index] || ''}
                          onChange={(e) => setNewComment(prev => ({
                            ...prev,
                            [index]: e.target.value
                          }))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCommentSubmit(index);
                            }
                          }}
                          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                        <button
                          onClick={() => handleCommentSubmit(index)}
                          disabled={!newComment[index]?.trim()}
                          className="ml-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          aria-label="Submit comment"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
}



