import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import Image from "next/image";
import MenuItem from "./MenuItem";
import {theme} from "../../styles/defaultTheme";
import Login from "./Login";
import Settings from "./Settings";
import Account from "./Account";
import AboutUs from "./AboutUs";
import {auth} from "../../firebase";
import {setShowLoginPopup, getShowLoginPopup} from "./loginPopUpVariable";
import {useRouter} from "next/router";
import {useAuth} from "../../useAuth";
import {ref, onValue} from "firebase/database";
import {db} from "../../firebase";

const ProfileDropdown = () => {
  const personIcon = require("../Icons/personIcon.png");
  const menuAccountIcon = require("../Icons/ProfileMenuIcons/account.png");
  const menuSettingsIcon = require("../Icons/ProfileMenuIcons/setting.png");
  const menuAboutUsIcon = require("../Icons/ProfileMenuIcons/question.png");
  const menuLogOutIcon = require("../Icons/ProfileMenuIcons/exit.png");

  // User logged in handling
  const user = useAuth();
  const [personalInfo, setPersonalInfo] = useState();

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user.uid}/PersonalInformation`);

      const dataListener = onValue(userRef, (snapshot) => {
        const fetchedData = snapshot.val();
        setPersonalInfo(fetchedData);
      });

      return () => {
        dataListener();
      };
    }
  });

  // User logout handle

  const router = useRouter();
  const handleLogout = () => {
    auth.signOut();
    setDropdownMenuOpen(false);

    if (router.pathname === "/Lists") {
      router.push("/");
    }
  };

  //Dropdown menu handling

  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const dropdownMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
      ) {
        setDropdownMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownMenuRef]);

  // Login popup handling

  useEffect(() => {
    const handleCreateAccountOpenLogin = () => {
      if (getShowLoginPopup()) {
        setLoginMenuOpen(true);
        setShowLoginPopup(false);
      }
    };

    handleCreateAccountOpenLogin();
  }, []);

  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  const handleCloseLogin = () => {
    setLoginMenuOpen(false);
  };

  // Acount popup handling

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleCloseAccount = () => {
    setAccountMenuOpen(false);
  };

  // About us popup handling

  const [aboutUsMenuOpen, setAboutUsMenuOpen] = useState(false);

  const handleCloseAboutUs = () => {
    setAboutUsMenuOpen(false);
  };

  // Settings us popup handling

  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const handleCloseSettings = () => {
    setSettingsMenuOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        {user === null && (
          <LoginButton
            onClick={() => {
              setLoginMenuOpen(true);
            }}
          >
            Login
          </LoginButton>
        )}
        <ImageWrapper>
          <Image
            onClick={() => {
              setDropdownMenuOpen(true);
            }}
            src={personIcon}
            width={40}
            height={40}
            alt="personIcon"
          />
        </ImageWrapper>
      </HeaderContainer>
      {dropdownMenuOpen && (
        <>
          <Backdrop />
          <SettingsMenu ref={dropdownMenuRef}>
            {user != null && personalInfo && (
              <>
                <TopSection>
                  <Image
                    src={personIcon}
                    width={40}
                    height={40}
                    alt="personIcon"
                  />
                  <TextTopSection>
                    <H1>{personalInfo.nickname}</H1>
                    <P>{personalInfo.email}</P>
                  </TextTopSection>
                </TopSection>
                <div
                  onClick={() => {
                    setDropdownMenuOpen(false);
                    setAccountMenuOpen(true);
                  }}
                >
                  <MenuItem
                    menuItemImage={menuAccountIcon}
                    text="Profile"
                  ></MenuItem>
                </div>
              </>
            )}
            <div
              onClick={() => {
                setDropdownMenuOpen(false);
                setSettingsMenuOpen(true);
              }}
            >
              <MenuItem
                menuItemImage={menuSettingsIcon}
                text="Settings"
              ></MenuItem>
            </div>
            <div
              onClick={() => {
                setDropdownMenuOpen(false);
                setAboutUsMenuOpen(true);
              }}
            >
              <MenuItem
                menuItemImage={menuAboutUsIcon}
                text="About us"
              ></MenuItem>
            </div>
            {user != null && personalInfo && (
              <div
                onClick={() => {
                  handleLogout();
                  setDropdownMenuOpen(false);
                }}
              >
                <MenuItem
                  menuItemImage={menuLogOutIcon}
                  text="Logout"
                />
              </div>
            )}
          </SettingsMenu>
        </>
      )}

      {loginMenuOpen && <Login handleCloseLogin={handleCloseLogin} />}
      {aboutUsMenuOpen && <AboutUs handleCloseAboutUs={handleCloseAboutUs} />}
      {accountMenuOpen && <Account handleCloseAccount={handleCloseAccount} />}
      {settingsMenuOpen && (
        <Settings handleCloseSettings={handleCloseSettings} />
      )}
    </>
  );
};

export default ProfileDropdown;

const SettingsMenu = styled.div`
  position: absolute;
  z-index: 2;
  top: 90px;
  right: 20px;
  background-color: ${theme.colors.white};
  padding: ${theme.spacings.px10} ${theme.spacings.px20};
  width: 250px;
  border-radius: ${theme.spacings.px10};

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: 43px;
    background-color: ${theme.colors.white};
    height: ${theme.spacings.px20};
    width: ${theme.spacings.px20};
    transform: rotate(45deg);
  }
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  padding-bottom: ${theme.spacings.px10};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const TextTopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding-left: ${theme.spacings.px10};
`;

const H1 = styled.h1`
  margin: 0;
  font-size: ${theme.fontSizes.px20};
  font-weight: ${theme.fontWeight.w500};
`;

const P = styled.p`
  font-size: ${theme.fontSizes.px15};
  font-weight: ${theme.fontWeight.w300};
  margin: 0;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const LoginButton = styled.div`
  display: flex;
  color: ${theme.colors.white};
  background-color: ${theme.colors.greenDark};
  font-size: ${theme.fontSizes.px20};
  font-weight: ${theme.fontWeight.w500};
  padding: ${theme.spacings.px5} ${theme.spacings.px10};
  text-align: center;
  border-radius: ${theme.spacings.px10};
  box-shadow: ${theme.shadows.default};
  margin-right: ${theme.spacings.px20};
  cursor: pointer;

  &:hover {
    box-shadow: ${theme.shadows.hoverShadow};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  /* border-radius: 999px;
  border: 1px solid beige;
  padding: 2px; */
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;
