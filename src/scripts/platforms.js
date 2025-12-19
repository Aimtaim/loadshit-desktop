// LoadSh.it Desktop - Platform Detection & Icons
// Supports 100+ platforms for yt-dlp

// Platform definitions with URL patterns and SVG icons
export const PLATFORMS = {
  youtube: {
    name: 'YouTube',
    patterns: [
      /youtube\.com/i,
      /youtu\.be/i,
      /youtube-nocookie\.com/i,
      /music\.youtube\.com/i
    ],
    color: '#FF0000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>`
  },
  tiktok: {
    name: 'TikTok',
    patterns: [/tiktok\.com/i, /vm\.tiktok\.com/i, /vt\.tiktok\.com/i],
    color: '#000000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>`
  },
  instagram: {
    name: 'Instagram',
    patterns: [/instagram\.com/i, /instagr\.am/i, /ddinstagram\.com/i],
    color: '#E4405F',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>`
  },
  twitter: {
    name: 'X / Twitter',
    patterns: [/twitter\.com/i, /x\.com/i, /t\.co/i, /fxtwitter\.com/i, /vxtwitter\.com/i, /fixupx\.com/i],
    color: '#000000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  },
  facebook: {
    name: 'Facebook',
    patterns: [/facebook\.com/i, /fb\.watch/i, /fb\.com/i, /fbcdn\.net/i, /facebook\.net/i],
    color: '#1877F2',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  },
  vimeo: {
    name: 'Vimeo',
    patterns: [/vimeo\.com/i, /player\.vimeo\.com/i],
    color: '#1AB7EA',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/></svg>`
  },
  twitch: {
    name: 'Twitch',
    patterns: [/twitch\.tv/i, /clips\.twitch\.tv/i, /go\.twitch\.tv/i],
    color: '#9146FF',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`
  },
  reddit: {
    name: 'Reddit',
    patterns: [/reddit\.com/i, /redd\.it/i, /v\.redd\.it/i, /old\.reddit\.com/i],
    color: '#FF4500',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`
  },
  soundcloud: {
    name: 'SoundCloud',
    patterns: [/soundcloud\.com/i, /snd\.sc/i],
    color: '#FF5500',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.102-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.19-1.308-.19-1.334c-.01-.057-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.106.104.061 0 .12-.044.12-.104l.24-2.474-.24-2.547c0-.06-.059-.104-.12-.104m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.225-2.544-.225-2.64c-.015-.075-.074-.135-.149-.135m2.97-.959c-.42 0-.81.09-1.17.254-.149-1.605-1.5-2.85-3.149-2.85-.39 0-.779.075-1.14.209-.135.045-.179.105-.179.225v7.919c0 .12.09.224.21.239h5.43c1.335 0 2.415-1.095 2.415-2.43 0-1.335-1.08-2.43-2.415-2.43"/></svg>`
  },
  dailymotion: {
    name: 'Dailymotion',
    patterns: [/dailymotion\.com/i, /dai\.ly/i],
    color: '#0066DC',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.927 10.639c-1.39 0-2.468 1.14-2.468 2.519 0 1.386 1.078 2.527 2.468 2.527 1.381 0 2.463-1.141 2.463-2.527 0-1.379-1.082-2.519-2.463-2.519zM18.975 0H5.025C2.25 0 0 2.25 0 5.025v13.95C0 21.75 2.25 24 5.025 24h13.95C21.75 24 24 21.75 24 18.975V5.025C24 2.25 21.75 0 18.975 0z"/></svg>`
  },
  bilibili: {
    name: 'Bilibili',
    patterns: [/bilibili\.com/i, /b23\.tv/i, /bilibili\.tv/i],
    color: '#00A1D6',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906z"/></svg>`
  },
  pinterest: {
    name: 'Pinterest',
    patterns: [/pinterest\.com/i, /pin\.it/i, /pinterest\.[a-z]+/i],
    color: '#BD081C',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>`
  },
  linkedin: {
    name: 'LinkedIn',
    patterns: [/linkedin\.com/i, /lnkd\.in/i],
    color: '#0A66C2',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
  },
  tumblr: {
    name: 'Tumblr',
    patterns: [/tumblr\.com/i, /tmblr\.co/i],
    color: '#36465D',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l-.009.002z"/></svg>`
  },
  spotify: {
    name: 'Spotify',
    patterns: [/spotify\.com/i, /open\.spotify\.com/i],
    color: '#1DB954',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`
  },
  vk: {
    name: 'VK',
    patterns: [/vk\.com/i, /vkvideo\.ru/i, /vk\.ru/i],
    color: '#0077FF',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0z"/></svg>`
  },
  niconico: {
    name: 'Niconico',
    patterns: [/nicovideo\.jp/i, /nico\.ms/i, /niconico\.com/i],
    color: '#231F20',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h19c1.1046 0 2.0213-.9167 2.0213-2.0213V7.534c0-1.1046-.9167-2.0213-2.0213-2.0213H7.835L5.3747.6218A.493.493 0 0 0 4.9487.334a.4887.4887 0 0 0-.4.2133L2.5.6218 1.034 5.5127H2.5a2.0213 2.0213 0 0 0-2.0213 2.0213z"/></svg>`
  },
  // Additional platforms
  snapchat: {
    name: 'Snapchat',
    patterns: [/snapchat\.com/i, /story\.snapchat\.com/i, /snap\.com/i],
    color: '#FFFC00',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.809-.329-1.24-.719-1.226-1.168 0-.36.285-.69.735-.838.149-.06.344-.09.524-.09.12 0 .285.015.435.104.389.18.748.3 1.048.3.179 0 .315-.045.389-.089-.016-.18-.03-.359-.045-.539l-.003-.045c-.104-1.633-.223-3.669.298-4.862C7.86 1.069 11.216.793 12.206.793z"/></svg>`
  },
  rumble: {
    name: 'Rumble',
    patterns: [/rumble\.com/i],
    color: '#85C742',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5 13.5l-7 4.5V8l7 5.5z"/></svg>`
  },
  odysee: {
    name: 'Odysee',
    patterns: [/odysee\.com/i, /lbry\.tv/i],
    color: '#F44F5F',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  bitchute: {
    name: 'BitChute',
    patterns: [/bitchute\.com/i],
    color: '#EF4136',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  peertube: {
    name: 'PeerTube',
    patterns: [/peertube\./i, /tube\./i, /videos\./i],
    color: '#F1680D',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  dtube: {
    name: 'DTube',
    patterns: [/d\.tube/i, /dtube\.video/i],
    color: '#FF0000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  coub: {
    name: 'Coub',
    patterns: [/coub\.com/i],
    color: '#1DA1F2',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  mixcloud: {
    name: 'Mixcloud',
    patterns: [/mixcloud\.com/i],
    color: '#5000FF',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.57 12.556c0 2.634.94 4.893 2.822 6.778 1.881 1.886 4.143 2.828 6.785 2.828.855 0 1.676-.106 2.463-.318V16.59a5.24 5.24 0 0 1-1.903.353c-1.468 0-2.722-.52-3.762-1.56-1.04-1.04-1.56-2.294-1.56-3.762 0-1.467.52-2.721 1.56-3.761 1.04-1.04 2.294-1.56 3.762-1.56.698 0 1.345.128 1.94.385V1.36c-.719-.129-1.44-.193-2.163-.193-2.642 0-4.904.942-6.785 2.828C2.51 5.879 1.57 8.137 1.57 10.77v1.785z"/></svg>`
  },
  bandcamp: {
    name: 'Bandcamp',
    patterns: [/bandcamp\.com/i],
    color: '#629AA9',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z"/></svg>`
  },
  audiomack: {
    name: 'Audiomack',
    patterns: [/audiomack\.com/i],
    color: '#FFA200',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  flickr: {
    name: 'Flickr',
    patterns: [/flickr\.com/i, /flic\.kr/i],
    color: '#0063DC',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 12c0 3.074 2.494 5.564 5.565 5.564 3.075 0 5.569-2.49 5.569-5.564S8.641 6.436 5.565 6.436C2.495 6.436 0 8.926 0 12zm12.866 0c0 3.074 2.493 5.564 5.567 5.564C21.502 17.564 24 15.074 24 12s-2.498-5.564-5.567-5.564c-3.074 0-5.567 2.49-5.567 5.564z"/></svg>`
  },
  imgur: {
    name: 'Imgur',
    patterns: [/imgur\.com/i, /i\.imgur\.com/i],
    color: '#1BB76E',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  gfycat: {
    name: 'Gfycat',
    patterns: [/gfycat\.com/i],
    color: '#1DA1F2',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  giphy: {
    name: 'GIPHY',
    patterns: [/giphy\.com/i, /gph\.is/i],
    color: '#00FF99',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.666 0v24h18.668V8.666l-2.668 2.666V21.334H5.334V2.666h10.668L18.668 0H2.666zm18.668 0L12 8.666l2.666.002L21.334 2v6.666H24V0h-2.666z"/></svg>`
  },
  streamable: {
    name: 'Streamable',
    patterns: [/streamable\.com/i],
    color: '#0F90FA',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5 13.5l-7 4.5V8l7 5.5z"/></svg>`
  },
  vidme: {
    name: 'VidMe',
    patterns: [/vid\.me/i],
    color: '#4EBE93',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  metacafe: {
    name: 'Metacafe',
    patterns: [/metacafe\.com/i],
    color: '#F7BE00',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  veoh: {
    name: 'Veoh',
    patterns: [/veoh\.com/i],
    color: '#FF6600',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  liveleak: {
    name: 'LiveLeak',
    patterns: [/liveleak\.com/i],
    color: '#FFF000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  vidlii: {
    name: 'VidLii',
    patterns: [/vidlii\.com/i],
    color: '#009900',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Asian platforms
  youku: {
    name: 'Youku',
    patterns: [/youku\.com/i, /v\.youku\.com/i],
    color: '#1E90FF',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  iqiyi: {
    name: 'iQIYI',
    patterns: [/iqiyi\.com/i, /iq\.com/i],
    color: '#00BE06',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  weibo: {
    name: 'Weibo',
    patterns: [/weibo\.com/i, /weibo\.cn/i, /video\.weibo\.com/i],
    color: '#E6162D',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443z"/></svg>`
  },
  qq: {
    name: 'QQ Video',
    patterns: [/v\.qq\.com/i, /qq\.com\/video/i],
    color: '#12B7F5',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  douyin: {
    name: 'Douyin',
    patterns: [/douyin\.com/i, /iesdouyin\.com/i],
    color: '#000000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>`
  },
  // Streaming platforms
  twitcasting: {
    name: 'TwitCasting',
    patterns: [/twitcasting\.tv/i],
    color: '#0096FA',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  mildom: {
    name: 'Mildom',
    patterns: [/mildom\.com/i],
    color: '#0052CC',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // News and media
  cnn: {
    name: 'CNN',
    patterns: [/cnn\.com/i, /edition\.cnn\.com/i],
    color: '#CC0000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  bbc: {
    name: 'BBC',
    patterns: [/bbc\.com/i, /bbc\.co\.uk/i],
    color: '#BB1919',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  nytimes: {
    name: 'NY Times',
    patterns: [/nytimes\.com/i, /nyti\.ms/i],
    color: '#000000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  washingtonpost: {
    name: 'Washington Post',
    patterns: [/washingtonpost\.com/i, /wapo\.st/i],
    color: '#000000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Adult content (SFW icon only)
  pornhub: {
    name: 'PornHub',
    patterns: [/pornhub\.com/i],
    color: '#FFA31A',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  xvideos: {
    name: 'XVideos',
    patterns: [/xvideos\.com/i],
    color: '#C80000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  xhamster: {
    name: 'xHamster',
    patterns: [/xhamster\.com/i],
    color: '#F8A81D',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  redtube: {
    name: 'RedTube',
    patterns: [/redtube\.com/i],
    color: '#D50000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  youporn: {
    name: 'YouPorn',
    patterns: [/youporn\.com/i],
    color: '#E10050',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Educational
  ted: {
    name: 'TED',
    patterns: [/ted\.com/i],
    color: '#E62B1E',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  coursera: {
    name: 'Coursera',
    patterns: [/coursera\.org/i],
    color: '#0056D2',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  udemy: {
    name: 'Udemy',
    patterns: [/udemy\.com/i],
    color: '#A435F0',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  khanacademy: {
    name: 'Khan Academy',
    patterns: [/khanacademy\.org/i],
    color: '#14BF96',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Gaming
  steam: {
    name: 'Steam',
    patterns: [/store\.steampowered\.com/i, /steamcommunity\.com/i],
    color: '#000000',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Cloud storage
  dropbox: {
    name: 'Dropbox',
    patterns: [/dropbox\.com/i, /dropboxusercontent\.com/i],
    color: '#0061FF',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  googledrive: {
    name: 'Google Drive',
    patterns: [/drive\.google\.com/i, /docs\.google\.com/i],
    color: '#4285F4',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  onedrive: {
    name: 'OneDrive',
    patterns: [/onedrive\.live\.com/i, /1drv\.ms/i],
    color: '#0078D4',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  mega: {
    name: 'MEGA',
    patterns: [/mega\.nz/i, /mega\.co\.nz/i],
    color: '#D9272E',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  mediafire: {
    name: 'MediaFire',
    patterns: [/mediafire\.com/i],
    color: '#1299F3',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // European platforms
  arte: {
    name: 'ARTE',
    patterns: [/arte\.tv/i],
    color: '#FF6600',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  ard: {
    name: 'ARD',
    patterns: [/ardmediathek\.de/i, /daserste\.de/i],
    color: '#0D4D8B',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  zdf: {
    name: 'ZDF',
    patterns: [/zdf\.de/i],
    color: '#FA7D19',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Sports
  espn: {
    name: 'ESPN',
    patterns: [/espn\.com/i],
    color: '#CD1818',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  mlb: {
    name: 'MLB',
    patterns: [/mlb\.com/i],
    color: '#002D72',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  nba: {
    name: 'NBA',
    patterns: [/nba\.com/i],
    color: '#1D428A',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  nfl: {
    name: 'NFL',
    patterns: [/nfl\.com/i],
    color: '#013369',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Misc
  vlive: {
    name: 'V LIVE',
    patterns: [/vlive\.tv/i, /v-live\.com/i],
    color: '#1ECFFF',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  weverse: {
    name: 'Weverse',
    patterns: [/weverse\.io/i],
    color: '#1DD2FF',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  afreecatv: {
    name: 'AfreecaTV',
    patterns: [/afreecatv\.com/i],
    color: '#006699',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  naver: {
    name: 'Naver',
    patterns: [/naver\.com/i, /tv\.naver\.com/i],
    color: '#03C75A',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  kakao: {
    name: 'Kakao',
    patterns: [/kakao\.com/i, /tv\.kakao\.com/i],
    color: '#FFCD00',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/></svg>`
  },
  // Direct video URLs
  directvideo: {
    name: 'Direct Video',
    patterns: [/\.mp4$/i, /\.webm$/i, /\.mkv$/i, /\.mov$/i, /\.avi$/i, /\.flv$/i, /\.m3u8$/i, /\.mpd$/i],
    color: '#888888',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
  },
  unknown: {
    name: 'Video',
    patterns: [],
    color: '#888888',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`
  }
};

/**
 * Detect platform from URL
 * @param {string} url - The URL to check
 * @returns {object} Platform object with name, color, and icon
 */
export function detectPlatform(url) {
  if (!url) return null;

  const urlLower = url.toLowerCase();

  for (const [key, platform] of Object.entries(PLATFORMS)) {
    if (key === 'unknown') continue;

    for (const pattern of platform.patterns) {
      if (pattern.test(urlLower)) {
        return { key, ...platform };
      }
    }
  }

  // Return unknown if no match and URL looks valid
  try {
    new URL(url);
    return { key: 'unknown', ...PLATFORMS.unknown };
  } catch {
    return null;
  }
}

/**
 * Get all platform keys
 * @returns {string[]} Array of platform keys
 */
export function getAllPlatformKeys() {
  return Object.keys(PLATFORMS).filter(k => k !== 'unknown');
}

/**
 * Get platform count
 * @returns {number} Number of supported platforms
 */
export function getPlatformCount() {
  return Object.keys(PLATFORMS).length - 1; // Exclude 'unknown'
}
