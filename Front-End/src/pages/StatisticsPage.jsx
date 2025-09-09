import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import '../css/cssEstatistica.css'

const StatisticsPage = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const jsonData = location.state?.data;
  const [bilhetes, setBilhetes] = useState([]);
  const [porcentagem, setPorcentagem] = useState();
  const [bilhetesFraude, setBilhetesFraude] = useState();

  const comparadorJson = async () => {
    try {
      const response = await fetch("http://localhost:3000/comparador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        const json = await response.json();
        setBilhetes(json);
      } else {
        console.error("Erro ao enviar o arquivo:", response.statusText);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };
  const calculaPorcentagem = (bilhetes) => {
    const bilhetesValidos = bilhetes.filter((bilhete) => bilhete.numerosIguais);

    const totalBilhetes = bilhetes.length;

    const bilhetesValidosCount = bilhetesValidos.length;
    const porcentagemValidos =
      totalBilhetes > 0
        ? ((bilhetesValidosCount / totalBilhetes) * 100).toFixed(2)
        : 0;
    return porcentagemValidos;
  };

  const generatePDF = async () => {
    const input = document.getElementById("bilhetes-container");

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; 
    const pageHeight = 295; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width; 

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("bilhetes.pdf");
  };

  const BilheteTable = ({
    title,
    bilhetes,
    isFraud,
    currentPage,
    bilhetesPerPage,
  }) => {
    const indexOfLastBilhete = currentPage * bilhetesPerPage;
    const indexOfFirstBilhete = indexOfLastBilhete - bilhetesPerPage;
    const currentBilhetes = bilhetes.slice(
      indexOfFirstBilhete,
      indexOfLastBilhete
    );

    return (
      <Box
        flex="1"
        border="1px solid lightgray"
        borderRadius="8px"
        p="16px"
        bg="white"
      >
        <Text
          fontWeight="bold"
          fontSize="xl"
          mb="16px"
          color={isFraud ? "red.500" : "green.500"}
        >
          {title}
        </Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID Bilhete</Th>
              <Th>Usuário</Th>
              <Th>Números Apostados</Th>
              <Th>Valor Aposta</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentBilhetes.map((bilhete) => (
              <Tr key={bilhete.idBilhete}>
                <Td>{bilhete.idBilhete}</Td>
                <Td>{bilhete.nomeCliente}</Td>
                <Td>
                  {bilhete.numerosSalvos.map((numero, index) => {
                    const isDifferent =
                      bilhete.numerosSalvos[index] !==
                      bilhete.numerosEnviados[index];

                    return (
                      <Text
                        as="span"
                        color={isFraud && isDifferent ? "red" : "inherit"}
                        key={index}
                      >
                        {numero}
                        {index < bilhete.numerosSalvos.length - 1 ? ", " : ""}
                      </Text>
                    );
                  })}
                </Td>
                <Td>R$ {bilhete.valorAposta}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };

  const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
    const [firstButton, setFirstButton] = useState(1);
    const lastButton = firstButton + 9;

    const pageNumbers = [];
    for (let i = firstButton; i <= Math.min(lastButton, totalPages); i++) {
      pageNumbers.push(i);
    }

    const handleNext = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        if (currentPage === lastButton && lastButton < totalPages) {
          setFirstButton(firstButton + 1);
        }
      }
    };

    const handlePrevious = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        if (currentPage === firstButton && firstButton > 1) {
          setFirstButton(firstButton - 1);
        }
      }
    };

    return (
      <Flex justifyContent="center" mt="20px" width={"60%"}>
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          Anterior
        </Button>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            onClick={() => setCurrentPage(number)}
            colorScheme={number === currentPage ? "blue" : "gray"}
          >
            {number}
          </Button>
        ))}
        <Button onClick={handleNext} disabled={currentPage === totalPages}>
          Próximo
        </Button>
      </Flex>
    );
  };

  const BilhetesContainer = ({ bilhetes }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageFraudados, setCurrentPageFraudados] = useState(1);
    const bilhetesPerPage = 10;

    const bilhetesFraudados = bilhetes.filter((bilhete) =>
      bilhete.numerosSalvos.some(
        (numero, index) => numero !== bilhete.numerosEnviados[index]
      )
    );

    const bilhetesVerdadeiros = bilhetesFraudados.map((bilheteFraudado) => ({
      ...bilheteFraudado, 
      numerosEnviados: bilheteFraudado.numerosSalvos, 
    }));

    setBilhetesFraude(bilhetesFraudados.length);

    const totalPagesVerdadeiros = Math.ceil(
      bilhetesVerdadeiros.length / bilhetesPerPage
    );
    const totalPagesFraudados = Math.ceil(
      bilhetesFraudados.length / bilhetesPerPage
    );

    return (
      <>
        <Flex
          mt={"25px"}
          width={"100%"}
          justifyContent={"space-between"}
          id="bilhetes-container"
          overflowX={{ base: "auto", md: "hidden" }} 
        >
          <BilheteTable
            title="Bilhetes Verdadeiros"
            bilhetes={bilhetesVerdadeiros}
            isFraud={false}
            currentPage={currentPage}
            bilhetesPerPage={bilhetesPerPage}
          />
          <BilheteTable
            title="Bilhetes Fraudados"
            bilhetes={bilhetesFraudados}
            isFraud={true}
            currentPage={currentPageFraudados}
            bilhetesPerPage={bilhetesPerPage}
          />
        </Flex>

        <Flex justifyContent={"space-around"}>
          <Pagination
            totalPages={totalPagesVerdadeiros}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Flex>
      </>
    );
  };

  useEffect(() => {
    comparadorJson();
  }, []);

  useEffect(() => {
    if (bilhetes && bilhetes.length > 0) {
      const porcentagem = calculaPorcentagem(bilhetes);
      console.log(porcentagem);
      setPorcentagem(porcentagem);
    }
  }, [bilhetes]);

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
            <Text fontWeight={"bold"} fontSize={["16px", "24px", "36px"]} className="texto-grande">
              Conferência automática de Bilhetes
            </Text>
          </Box>
          <Flex
            bg={"white"}
            width={"75%"}
            mt={"25px"}
            border={"1px solid lightgray"}
            height={"300px"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Flex
              justifyContent={"space-around"}
              alignItems="center"
              width={"80%"}
            >
              <CircularProgress
                value={porcentagem}
                size="160px"
                thickness="12px"
                color="green.400"
              >
                <CircularProgressLabel>{porcentagem}%</CircularProgressLabel>
              </CircularProgress>

              <Box>
                <Text fontSize="lg" className="responsive-text">
                  • Após uma analise nos <strong>{bilhetes.length}</strong> bilhetes foram constatados apenas{" "}
                  <strong>{bilhetesFraude}</strong> bilhetes fraudados
                </Text>
                <Text fontSize="lg" color="green.500" className="responsive-text">
                  • resultado da conferência concluído e disponível abaixo.
                </Text>
              </Box>
            </Flex>
          </Flex>
          <Flex flexDirection={"column"} width={"75%"}>
            <BilhetesContainer bilhetes={bilhetes} />

            <Flex mt={"6px"} bg={"white"} height={"80px"} alignItems={"center"}>
              <Button ml={"8px"} colorScheme="green" onClick={generatePDF}>
                Baixar PDF
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default StatisticsPage;
