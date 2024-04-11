import React, { FC, useState } from "react";
import { SiWebmoney } from "react-icons/si";
import Button from "@/components/common/Button";
import Link from "next/link";
import { ConnectWallet, lightTheme } from "@thirdweb-dev/react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import { ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
// import { useRouter } from 'next/navigation';

const Nav: FC = () => {
  // const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const path = event.target.value;
  //   if (path) {
  //     router.push(path);
  //   }
  // };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navLinks = [
    {
      title: "Launch",
      subItems: [
        { title: "Create Proposal", path: "/launch/create-proposal" },
        { title: "Convert Proposal", path: "/launch/convert-proposal" },
      ],
    },
    {
      title: "Explore",
      subItems: [
        { title: "Ongoing Proposals", path: "/explore/ongoing-proposals" },
        {
          title: "Crowdfunding Events",
          path: "/explore/crowdfunding-events",
        },
      ],
    },
   
  ];

  return (
    <div className="px-6 py-4 shadow-sm flex justify-between items-center bg-black">
      <div className="flex gap-2 items-center">
        <div className="text-2xl">
          <img
            src="https://s3-alpha-sig.figma.com/img/ded1/5e70/6abc11dc8c26491992b8652894cdb0c7?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bdIXPRpItjJFLy3-a1pylCgmeEXUeBYYrc~H-d1EAHtW4jce0mFIAwBlqxylbJaoaRPZgGcsfv62vWTc9s73CgG7bQxagb-uZZGk31XX0on4EQ0OOwf2crpWMmIF9Bm1U6INPlG4EB4522PTIQYtHK9y5lt66u1qCv3kxxMiGGJV-dKkoyGkdkw0Ne5su-5OfkdTncspOswUDjiKcw3OBowd0qJL8WHx7TRgABnqSv0GWp69mqDpO9XMUNmqPOS0mOIeGSSdlXBNJkU5H9jFK8yYMMrD3uoBqRyYLUBgt63WM~seLUWfyJASm5wI64Z0R30LzGljZx2jtz-H8Ia1HA__"
            alt=""
            width="30px"
            height="10px"
          />
        </div>
        <div className="text-white text-xl font-semibold">
          <a href="/">Dream Starter</a>
        </div>
      </div>

      <div className="flex gap-4 items-center text-white">
        {navLinks.map((navItem) => (
          <div
            key={navItem.title}
            className="relative  cursor-pointer"
            onMouseEnter={() => setActiveDropdown(navItem.title)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {navItem.title}
            {navItem.subItems && (
              <div
                className={`absolute left-0 w-48 py-2 px-2 bg-black rounded-md shadow-xl  ${activeDropdown === navItem.title ? "block" : "hidden"
                  }`}
              >
                {navItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-500 rounded-md"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <a href="/community/create-community">Community</a>
        <ConnectButton/>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <List>
              <Button sx={{ color: "grey" }}>Profile</Button>
               <br />
              <a href="/dashboard/dashboard"><Button sx={{ color: "grey" }}>Dashboard</Button></a>
              <br />
              <Button sx={{ color: "grey" }}>Settings</Button>
              <br />
              <Button sx={{ color: "rgb(239, 101, 101)" }}>Logout</Button>
            </List>
          </Menu>
        </Box>
      </div>
    </div>
  );
};

export default Nav;
