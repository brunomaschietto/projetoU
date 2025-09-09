import { Box, Button, Container, Flex, Input, Text } from "@chakra-ui/react";
import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

function App() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [value, setValue] = useState("");

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const telaEstatistica = async () => {
    if (!selectedFile) {
      fileInputRef.current.click();
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        navigate("/emailValidado", { state: { data: json } });
      } else {
        console.error("Erro ao enviar o arquivo:", response.statusText);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  const enviarTexto = async () => {
    if (!value.trim()) return;

    const formData = new FormData();
    formData.append("text", value); 

    try {
      const response = await fetch("http://localhost:3000/classify-text", {
        method: "POST",
        body: formData, 
      });

      if (response.ok) {
        const json = await response.json();
        navigate("/emailValidado", { state: { data: json } });
      } else {
        console.error("Erro ao enviar o texto:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar o texto:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      telaEstatistica(file);
    }
  };
  return (
    <>
      <Container maxW={"container.xxl"} maxHeight={"100vh"}>
        <Flex
          flexDirection={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box
            bg={"white"}
            width={"75%"}
            mt={"25px"}
            border={"1px solid lightgray"}
            borderRadius={"8px"}
            height={"90px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"} fontSize={"36px"}>
              Processador de emails
            </Text>
          </Box>
          <Box
            bg={"white"}
            width={"75%"}
            mt={"25px"}
            border={"1px solid lightgray"}
            height={"700px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box>
              <Text fontWeight={"bold"} fontSize={"48px"}>
                Insira o Email em <br />
                TXT ou PDF e <br />o sistema irá fazer a análise
              </Text>
              <Text fontSize={"24px"}>100% automático</Text>
            </Box>
            <Box
              width={"40%"}
              display="flex"
              flexDirection={"column"}
              justifyContent="center"
              alignItems="center"
              gap={"50px"}
            >
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  height: "120px",
                  wordBreak: "break-word"
                }}
              />
              <Box
                borderRadius="20px"
                bg="#fafafa"
                height="400px"
                width={"100%"}
                display="flex"
                flexDirection={"column"}
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  borderRadius="18px"
                  bg="#f5f5f5"
                  height="380px"
                  display="flex"
                  width={"90%"}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  boxShadow="md"
                >
                  <Box
                    borderRadius="16px"
                    bg="#f0f0f0"
                    height="360px"
                    display="flex"
                    width={"90%"}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box
                      borderRadius="14px"
                      bg="white"
                      height="340px"
                      display="flex"
                      width={"90%"}
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        accept=".txt, .pdf"
                      />
                      <Button
                        bg="blue.500"
                        color="white"
                        _hover={{ bg: "blue.600" }}
                        borderRadius="full"
                        size="lg"
                        mb={4}
                        onClick={telaEstatistica}
                        isDisabled={stripHtml(value).trim().length > 0}
                      >
                        Faça upload
                      </Button>

                      <Text fontWeight="bold" fontSize="md" color="gray.600">
                        ou arraste o arquivo
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        ou clique para selecionar
                      </Text>
                      <Button
                        bg="green.500"
                        color="white"
                        _hover={{ bg: "green.600" }}
                        borderRadius="full"
                        size="lg"
                        mb={4}
                        mt={4}
                        onClick={value.trim().length > 0 ? enviarTexto : telaEstatistica}
                      >
                        Enviar
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </>
  );
}

export default App;
