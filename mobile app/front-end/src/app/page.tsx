"use client"
import { SiWebmoney } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";
import { ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

export default function Home() {
  return (
    <>
      <main className="flex justify-center w-auto items-center h-screen bg-gradient-to-t  from-purple-900 via-purple-600 to-black animate-gradient relative">

        {/* Absolute Positioned Images */}
        {/* <div className="absolute" style={{ width: "230px", height: "250px", top: "10%", left: "80%", opacity: "0.5", transform: "rotate(25.85deg)" }}>
          <img src="https://via.placeholder.com/230x250" alt="Image" className="w-full h-full object-cover" />
        </div>
        <div className="absolute" style={{ width: "230px", height: "250px", top: "30%", left: "80%", opacity: "0.5", transform: "rotate(25.85deg)" }}>
          <img src="https://via.placeholder.com/230x250" alt="Image" className="w-full h-full object-cover" />
        </div>
        <div className="absolute" style={{ width: "270px", height: "270px", top: "25%", left: "10%", opacity: "0.5", transform: "rotate(25.85deg)" }}>
          <img src="https://via.placeholder.com/270x270" alt="Image" className="w-full h-full object-cover" />
        </div> */}

        {/* Main Content */}
        <div className="text-white text-center">
          <div className="font-medium text-6xl">Where Dreams Meet Reality</div>
          <div className="text-lg mt-2 mb-4">Crowdfund Your Next Big Event with Us</div>
          <div className="mt-4">
            <ConnectButton className="max-w-32 z-10" />
          </div>
        </div>

      </main>

      {/* Features Section */}
      <div className="bg-gradient-to-t from-black via-purple-900 to-purple-900">
        <div className="container mx-auto py-20 px-4">

          <div className="text-center">
            <h1 className="text-white text-7xl">Instant Event Magic</h1>
            <h2 className="text-white text-3xl">Easy Event Planning at Your Fingertips</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-center mt-12">
            <div className="md:w-1/3 mx-4 mb-8">
              <div className="bg-purple-500 p-8 rounded-2xl text-white">
                <h3 className="text-2xl mb-4">Build Your Community</h3>
                <p>Shape a digital community where you and like-minded individuals govern together.</p>
              </div>
            </div>
            <div className="md:w-1/3 mx-4 mb-8">
              <div className="bg-purple-500 p-8 rounded-2xl text-white">
                <h3 className="text-2xl mb-4">Plan Your Events</h3>
                <p>Easily organize, manage, and spread the word about your gatherings.</p>
              </div>
            </div>
            <div className="md:w-1/3 mx-4 mb-8">
              <div className="bg-purple-500 p-8 rounded-2xl text-white">
                <h3 className="text-2xl mb-4">Earn With Events</h3>
                <p>Enjoy a portion of event earnings by holding relevant NFTs.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-purple-500 p-20 rounded-2xl text-white">
              <h1 className="text-4xl">Create Communities, Launch Events Effortlessly</h1>
              <div className="mt-3">
                <ConnectButton className="max-w-32" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black">
        <div className="container mx-auto py-10 px-6">
          <div className="flex justify-center">
            <a href="#" className="text-white mx-5">
              <FaTwitter size={40} />
            </a>
            <a href="#" className="text-white mx-2">
              <BsTelegram size={40} />
            </a>
          </div>
        </div>
        <div className="bg-black py-4 text-white text-center">
          <p>&copy; 2023; Designed by <span className="text-gray-400">Noman</span></p>
        </div>
      </footer>
    </>
  );
}
