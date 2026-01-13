interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = ['Home', 'Simulation', 'Dashboard'];

  return (
    <header className="bg-black border-b border-neutral-800 px-8 py-6">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        <h1 className="text-3xl font-bold italic tracking-wider text-white" style={{ fontFamily: 'Georgia, serif' }}>
          <span className="opacity-90">Nova</span>
          <span className="opacity-95">X</span>
          <span className="opacity-90">Agent</span>
        </h1>

        <nav className="flex gap-12 ml-32">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`text-sm tracking-wide transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
