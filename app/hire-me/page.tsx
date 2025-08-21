export default function HireMePage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Status indicator */}
          <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 border border-border rounded-full backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-orange-400 font-medium">CURRENTLY UNAVAILABLE</span>
            </div>
          </div>

          {/* Main message */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Not Open to Work
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              I'm currently focused on personal projects and exploring new opportunities in the data science and AI space. 
              Not taking on new client work at the moment.
            </p>
          </div>

          {/* Contact alternative */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Want to stay updated? Follow me on{" "}
              <a 
                href="https://x.com/farhanoic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                X/Twitter
              </a>{" "}
              or{" "}
              <a 
                href="https://www.youtube.com/@farhanoic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                YouTube
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}