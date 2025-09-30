// Footer Component
// Footer = Copyright + Links

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2025 部落格系統. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              關於
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              聯絡
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              隱私政策
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}