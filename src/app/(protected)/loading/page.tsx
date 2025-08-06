export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Test Background - Visible gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-teal-900/30"></div> */}
        
        {/* Worldmap Background */}
        <div className="absolute inset-0 opacity-80 dark:opacity-50">
          <img 
            src="/images/worldmap.svg" 
            alt="" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              console.log('Worldmap image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
          
        </div>  
        <div className="absolute inset-0 opacity-80 dark:opacity-50">
         
           <img 
            src="/images/shades.svg" 
            alt="" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              console.log('Shades image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        {/* Animated Gradient Overlay */}
        {/* <div className="absolute inset-0 opacity-60 dark:opacity-40">
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-teal-500/30"
            style={{
              animation: 'backgroundPulse 4s ease-in-out infinite'
            }}
          ></div>
        </div> */}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Loading Text with Metro Theme */}
        <div className="text-center">
        {/* Company Logo */}


        
        <div className="mb-6 flex justify-center">
          <img 
            src="/images/logo.png" 
            alt="RATP Dev Mobility Cairo" 
            className="h-12 w-auto"
            style={{ maxWidth: '200px' }}
          />
        </div>
        
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ color: 'oklch(0.4008 0.1039 184.76)' }}
        >
          RDMC Portal
        </h2>
        <p 
          className="text-lg mb-4"
          style={{ color: 'oklch(0.5508 0.0739 184.76)' }}
        >
          Welcome back...
        </p>
        
        {/* Progress Bar */}
        {/* <div className="w-64 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, oklch(0.6008 0.1039 184.76), oklch(0.7008 0.1539 160.76))`,
              animation: 'progressBar 3s ease-in-out infinite'
            }}
          ></div>
        </div> */}
      </div>

      {/* Metro Train Animation */}
      <div className="relative w-80 h-20 mb-8">
        {/* Metro Track */}
        <div className="absolute bottom-2 left-0 right-0 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
        
        {/* Metro Train */}
        <div 
          className="absolute bottom-6 w-16 h-8 rounded-lg transform transition-transform duration-2000 ease-in-out"
          style={{
            backgroundColor: 'oklch(0.6008 0.1039 184.76)',
            animation: 'slideTrain 3s ease-in-out infinite'
          }}
        >
          {/* Train Windows */}
          <div className="flex justify-around items-center h-full px-1">
            <div 
              className="w-2 h-4 rounded-sm"
              style={{ backgroundColor: 'oklch(0.8508 0.0539 184.76)' }}
            ></div>
            <div 
              className="w-2 h-4 rounded-sm"
              style={{ backgroundColor: 'oklch(0.8508 0.0539 184.76)' }}
            ></div>
            <div 
              className="w-2 h-4 rounded-sm"
              style={{ backgroundColor: 'oklch(0.8508 0.0539 184.76)' }}
            ></div>
          </div>
          
          {/* Train Wheels */}
          <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full animate-spin"></div>
          <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full animate-spin"></div>
        </div>
        
        {/* Metro Stations (dots along the track) */}
        <div 
          className="absolute bottom-0 left-8 w-2 h-2 rounded-full"
         style={{ backgroundColor: '#aaaaaa' }}
        ></div>
        <div 
          className="absolute bottom-0 left-24 w-2 h-2 rounded-full animate-pulse"
         style={{ backgroundColor: '#aaaaaa' }}
        ></div>
        <div 
          className="absolute bottom-0 left-40 w-2 h-2 rounded-full"
          style={{ backgroundColor: '#aaaaaa' }}
        ></div>
        <div 
          className="absolute bottom-0 right-24 w-2 h-2 rounded-full"
          style={{ backgroundColor: '#aaaaaa' }}
        ></div>
        <div 
          className="absolute bottom-0 right-8 w-2 h-2 rounded-full"
          style={{ backgroundColor: '#aaaaaa' }}
        ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideTrain {
          0% { transform: translateX(0px); }
          50% { transform: translateX(240px); }
          100% { transform: translateX(0px); }
        }
        
        @keyframes progressBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        @keyframes backgroundPulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}