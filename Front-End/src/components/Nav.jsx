import {
  Box,
  IconButton,
  Flex,
  Spacer,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Link,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaUserAlt, FaHome, FaTicketAlt } from "react-icons/fa";
import React from 'react';
import { useNavigate } from "react-router-dom";

function Nav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const btnRef = React.useRef();

  const telaPrincipal = () => {
    navigate('/inicio');
  }

  return (
    <>
      <Box bg="white" px={4} boxShadow="md">
        <Flex h={16} alignItems="center">
          <IconButton
            ref={btnRef}
            size="md"
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
            variant="ghost"
            color="gray.500"
            _hover={{ bg: "gray.100" }}
            onClick={onOpen}
          />

          <Spacer />

          <IconButton
            size="md"
            icon={<FaUserAlt />}
            aria-label="User Profile"
            variant="ghost"
            color="gray.500"
            _hover={{ bg: "gray.100" }}
          />
        </Flex>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              <Link
                display="flex"
                alignItems="center"
                onClick={telaPrincipal}
                _hover={{ textDecoration: "none", color: "blue.500", bg: "gray.100" }}
              >
                <FaHome style={{ marginRight: '8px' }} />
                Início
              </Link>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Nav;
