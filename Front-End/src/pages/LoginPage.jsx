import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Text,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  const LoginPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
  
    const login = () => {
      navigate("/inicio");
    };
  
    const [form, setForm] = useState({
      email: "",
      password: "",
    });
  
    const onChangeForm = (event) => {
      setForm({ ...form, [event.target.name]: event.target.value });
    };
  
    return (
      <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"#ebebeb"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Login</Heading>
          </Stack>
          <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  onChange={onChangeForm}
                  autoComplete="off"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Senha</FormLabel>
                <Input type="password" name="password" onChange={onChangeForm} />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={login}
                >
                  {isLoading ? <Spinner /> : "Entrar"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  };
  
  export default LoginPage;
  