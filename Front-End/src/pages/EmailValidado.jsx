import {
  Box,
  Button,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

function BilhetesArmazenados() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.data;

  return (
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
            Email validado
          </Text>
        </Box>

        <Box
          bg={"white"}
          width={"75%"}
          mt={"25px"}
          border={"1px solid lightgray"}
          height={"700px"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            width={"100%"}
            border={"1px solid lightgray"}
            height={"400px"}
            overflowY={"auto"}
          >
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Conteúdo</Th>
                  <Th>Categoria</Th>
                  <Th>Resposta sugerida pelo sistema</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data ? (
                  <Tr>
                    <Td maxW="300px" whiteSpace="pre-wrap">
                      {data.conteudo}
                    </Td>
                    <Td>{data.categoria}</Td>
                    <Td maxW="300px" whiteSpace="pre-wrap">
                      {data.resposta_sugerida}
                    </Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td colSpan={3}>
                      <Text textAlign="center">Nenhum dado recebido.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Button
            colorScheme="blue"
            mt={4}
            onClick={() => navigate("/inicio")}
          >
            Voltar
          </Button>
        </Box>
      </Flex>
    </Container>
  );
}

export default BilhetesArmazenados;
