const MacBook3D = () => {
  return (
    <div className="macbook-container">
      <div className="macbook">
        <div className="macbook-shadow" />
        <div className="macbook-inner">
          <div className="macbook-screen">
            <div className="macbook-logo">
              <svg viewBox="0 0 170 170" fill="hsl(var(--primary))" xmlns="http://www.w3.org/2000/svg">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.25-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.05-7.41-11.76-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.3 3.72-6.33 8.67-11.33 14.86-14.99 6.19-3.66 12.88-5.53 20.08-5.63 3.92 0 9.06 1.21 15.43 3.59 6.36 2.39 10.44 3.6 12.24 3.6 1.34 0 5.87-1.42 13.56-4.24 7.27-2.62 13.41-3.71 18.44-3.28 13.63 1.1 23.87 6.47 30.68 16.15-12.19 7.39-18.22 17.73-18.1 31 .11 10.34 3.86 18.95 11.23 25.8 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.1-2.96 15.67-8.86 22.67-7.12 8.32-15.73 13.13-25.07 12.37a25.2 25.2 0 0 1-.19-3.07c0-7.78 3.39-16.09 9.4-22.89 3-3.44 6.82-6.31 11.45-8.6 4.62-2.26 8.99-3.51 13.1-3.72.12 1.1.17 2.2.17 3.24z"/>
              </svg>
            </div>
            <div className="macbook-face-one">
              <div className="macbook-camera" />
              <div className="macbook-display">
                <div className="macbook-display-shade" />
              </div>
              <span>JobMitra</span>
            </div>
          </div>
          <div className="macbook-body">
            <div className="macbook-body-face">
              <div className="macbook-touchpad" />
              <div className="macbook-keyboard">
                {/* Row 1 - function keys */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={`f${i}`} className="macbook-key f" />
                ))}
                {/* Rows 2-5 */}
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={`k${i}`} className="macbook-key" />
                ))}
                {/* Space bar row */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`s1-${i}`} className="macbook-key" />
                ))}
                <div className="macbook-key space" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`s2-${i}`} className="macbook-key" />
                ))}
              </div>
            </div>
            <div className="macbook-pad one" />
            <div className="macbook-pad two" />
            <div className="macbook-pad three" />
            <div className="macbook-pad four" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacBook3D;
