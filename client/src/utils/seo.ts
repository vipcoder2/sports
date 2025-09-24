
export const generateMetaTitle = (sport: string, isLive = false) => {
  const liveText = isLive ? "Live" : "";
  const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
  return `${liveText} ${sportName} Streaming - Free ${sportName} Streams Online | StreamSport`.trim();
};

export const generateMetaDescription = (sport: string, isLive = false) => {
  const liveText = isLive ? "live" : "";
  const sportName = sport.toLowerCase();
  return `Watch free ${liveText} ${sportName} streaming online. HD quality ${sportName} streams with real-time chat. All major ${sportName} leagues and tournaments available 24/7.`;
};

export const generateStructuredData = (pageType: string, data: any) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": `https://streamed.pk${data.url || ''}`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  };

  switch (pageType) {
    case 'sport':
      return {
        ...baseStructuredData,
        "name": `${data.sport} Live Streaming`,
        "description": `Free ${data.sport} live streams and matches`,
        "specialty": `${data.sport} Streaming`,
        "audience": `${data.sport} fans`
      };
    
    case 'match':
      return {
        ...baseStructuredData,
        "@type": "VideoObject",
        "name": data.title,
        "description": `Live stream of ${data.title}`,
        "thumbnailUrl": data.thumbnail,
        "isLiveBroadcast": true,
        "sport": data.sport
      };
    
    case 'schedule':
      return {
        ...baseStructuredData,
        "name": "Sports Schedule",
        "description": "Complete schedule of live and upcoming sports matches",
        "mainContentOfPage": "Sports Schedule"
      };
    
    default:
      return baseStructuredData;
  }
};

export const generateKeywords = (sport: string, additional: string[] = []) => {
  const sportLower = sport.toLowerCase();
  const baseKeywords = [
    `${sportLower} streaming`,
    `${sportLower} live streams`,
    `free ${sportLower} streams`,
    `${sportLower} online`,
    `watch ${sportLower} live`,
    `${sportLower} matches today`,
    `${sportLower} streaming free`,
    `live ${sportLower} streaming`,
    `${sportLower} stream online`,
    `${sportLower} schedule`,
    `${sportLower} live scores`,
    `${sportLower} highlights`,
    `${sportLower} news`,
    `${sportLower} fixtures`
  ];
  
  return [...baseKeywords, ...additional].join(', ');
};

export const generateSportSpecificKeywords = (sport: string) => {
  const sportLower = sport.toLowerCase();
  
  const sportKeywords: Record<string, string[]> = {
    football: ['soccer streaming', 'premier league streams', 'champions league live', 'world cup streaming', 'la liga streams', 'bundesliga live', 'serie a streaming', 'euro 2024', 'fifa world cup'],
    basketball: ['nba streaming', 'nba live streams', 'euroleague basketball', 'college basketball', 'march madness', 'nba playoffs', 'basketball highlights', 'fiba streams'],
    cricket: ['ipl streaming', 'test cricket live', 'odi cricket streams', 't20 cricket', 'world cup cricket', 'ashes cricket', 'bbl streams', 'psl cricket'],
    tennis: ['wimbledon streaming', 'us open tennis', 'french open live', 'australian open', 'atp tour streams', 'wta tennis', 'grand slam tennis'],
    'american-football': ['nfl streaming', 'nfl live streams', 'super bowl streaming', 'college football', 'nfl playoffs', 'monday night football', 'sunday night football'],
    boxing: ['boxing streams', 'boxing live fights', 'ppv boxing free', 'heavyweight boxing', 'boxing matches', 'fight night streams'],
    golf: ['pga tour streaming', 'masters golf', 'british open golf', 'us open golf', 'golf tournaments', 'european tour'],
    motorsports: ['f1 streaming', 'formula 1 live', 'motogp streams', 'nascar streaming', 'racing streams', 'grand prix live']
  };
  
  return sportKeywords[sportLower] || [];
};

export const addBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://streamed.pk${crumb.url}`
    }))
  };
};
