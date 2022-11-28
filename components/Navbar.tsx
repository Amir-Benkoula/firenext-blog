import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";

export default function AppNavbar() {
  const { user, username } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <Link href="/">Feed</Link>
        </li>
        {username && (
          <>
            {/* <li>
              <Link href="/chat">
                <button className="articles-button">Chat</button>
              </Link>
            </li> */}
            <li>
              <Link href="/admin">
                <button className="articles-button">Articles</button>
              </Link>
            </li>
            <li>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    alt="Profile Pic"
                    src={user?.photoURL || "/google.png"}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Link href={`/${username}`}>
                  <MenuItem>
                    <Avatar
                      alt="Profile Pic"
                      src={user?.photoURL || "/google.png"}
                    />
                    Profile
                  </MenuItem>
                </Link>
                <Link href="/" onClick={signOutNow}>
                <MenuItem>
                    Deconnexion
                </MenuItem>
                </Link>
              </Menu>
            </li>
          </>
        )}
        {!username && (
          <>
            <li>
              <Link href="/enter">Connexion</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
