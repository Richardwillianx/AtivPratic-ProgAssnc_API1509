import express, { Request, Response } from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (request: Request, response: Response) => {
  return response.send("OK");
});

app.get("/user/:name", async (req, res) => {
  const { name } = req.params;
  const userGH = await getUserFromGithub(name);

  res.json(userGH);
});

//===========================atividade 01====================================================

//01 - Transforme os seguintes trechos de código utilizando async e await.

import axios from "axios";

async function getUserFromGithub(user: string) {
  try {
    const { data } = await axios.get(`https://api.github.com/users/${user}`);
    console.log(data);
    return data;
  } catch (error) {
    console.error("Usuário não existe", error);
  }
  console.log("Usuário não existe");
}

async function getRepositories(repo: string) {
  try {
    const { data } = await axios.get(`https://api.github.com/repos/${repo}`);
    console.log(data);
    return data;
  } catch (error) {
    console.error("Repositório não existe", error);
  }
}

export { getRepositories, getUserFromGithub };
//==================fim atividade 01=============================================

//===========================atividade2====================================================

// 2. Criar uma rota chamada calculadora que deve receber 3 query
// params, uma sendo a operação a ser executada (soma,
// subtração...) e as outras duas sendo os valores a ser usado na
// operação.

// a. Ao chamar a seguinte rota
// .../calculadora?operacao=somar&valorA=7&valorB=13 deverá
// retornar o valor 20.

// b. Ao chamar a seguinte rota
// .../calculadora?operacao=subtrair&valorA=30&valorB=13
// deverá retornar o valor 17.

// c. Ao chamar a seguinte rota
// .../calculadora?operacao=multiplicar&valorA=8&valorB=8
// deverá retornar o valor 64.

// d. Ao chamar a seguinte rota
// .../calculadora?operacao=dividir&valorA=120&valorB=10
// deverá retornar o valor 12.

export default function calcular(
  operacao: string,
  valorA: number,
  valorB: number
): number {
  switch (operacao) {
    case "somar":
      return valorA + valorB;
    case "subtrair":
      return valorA - valorB;
    case "multiplicar":
      return valorA * valorB;
    case "dividir":
      return valorA / valorB;
    default:
      throw new Error("Operação inválida");
  }
}

app.get("/calculadora", (req, res) => {
  const { operacao, valorA, valorB } = req.query;
  try {
    if (!operacao || !valorA || !valorB) {
      return res.status(404).send("<h1>Falta parametro</h1>");
    }
    const response = calcular(
      operacao as string,
      Number(valorA),
      Number(valorB)
    );
    return res
      .status(200)
      .send(
        `<h1>A operaçao ${operacao} com os valores ${valorA} e ${valorB} resultou em ${response}</h1>`
      );
  } catch (erro: any) {
    console.error({ erro });
    return res.status(500).send(`<h1>${erro.message}</h1>`);
  }
});
//==================fim atividade 02=============================================

//=====================================Atividade 03=================================================
// 3 - Criar uma rota, que toda vez que for chamada, adiciona +1 a um
// contador. Toda vez que esse contador chegar a 10, exibir mensagem
// “Chegou à 10” e resetar o contador;

let contador = 0;

app.get("/contador", (req, res) => {
  contador++;
  if (contador >= 10) {
    contador = 0;
    return res.status(200).send("<h1>Parabéns, você chegou ao 10!</h1>");
  }
  return res
    .status(200)
    .send(`<h1>O valor atual do contador: ${contador}</h1>`);
});
//==================fim atividade3=============================================

//==================atividade 4=================================================
// 4. Criar uma rota chamada numeral, que terá como query param um
// número a ser processado. Nesta rota deverá ter também uma query
// param chamada operação contendo um dos seguintes valores:
// anterior ou proximo. Caso o valor seja anterior, deverá ser retornado
// o valor anterior ao passado no query param, caso o valor seja
// proximo, deverá retornar o próximo valor ao número passado.
// a. Ex 1:
// operacao = anterior
// numero = 5
// resultado = 4

// b. Ex 2:
// operacao = proximo
// numero = 5
// resultado = 6

app.get("/numeral", (req, res) => {
  const { numero, operacao } = req.query;
  if (
    !numero ||
    !operacao ||
    (operacao !== "proximo" && operacao != "anterior")
  ) {
    return res
      .status(400)
      .send("<h1>É necessário passar um número e uma operação</h1>");
  }

  return (operacao as string) === "anterior"
    ? res.send(`<h1> O numero ${operacao} ao ${numero} é ${Number(numero) - 1}`)
    : res.send(
        `<h1> O numero ${operacao} ao ${numero} é ${Number(numero) + 1}`
      );
  // return res.send(`${numero} e ${operacao}`)
});

//================================fim atividade 4 =================================================

//================================atividade 5=====================================================
// 5. Criar uma rota chamada inverter-string, essa rota deverá ter uma
// query param chamada valor. Esse valor recebido deverá ser
// invertido e retornado.

app.get("/inverter-string", (req, res) => {
  const { valor } = req.query;
  if (!valor) {
    return res.status(400).send("<h1>É necessário passar um valor</h1>");
  }
  return res.status(200).send(
    Array.from(valor as string)
      .reverse()
      .join("")
  );
});
//================================fim atividade 5 =================================================

//==================atividade 6=================================================
// 6 - Criar uma rota chamada remover-vogais, essa rota deverá ter uma
// query param chamada valor. Esse valor recebido deverá ser salvo
// em um array, e toda vez que a rota for chamada, deverá salvar o
// valor nesse mesmo array. Antes de salvar o valor/string no array,
// deverá ser removido todas as vogais, deixando apenas as
// consoantes na string. Sempre que a rota for chamada, deverá ser
// exibido em forma de json o array contendo todas as strings.
// a. Ex:
// array = []
// valor = edson
// array = [dsn]
// valor = lucas
// array = [dsn, lcs]

let letras: Array<string> = [];
let vogais = "aeiou";
app.get("/remover-vogais", (req, res) => {
  const { valor } = req.query;
  if (!valor) {
    return res.status(400).send("<h1>É necessário passar um valor</h1>");
  }
  let valorAtual = Array.from((valor as string).toLowerCase())
    .filter((letra) => !vogais.includes(letra))
    .join("");
  letras.push(valorAtual);
  return res.status(200).send(letras);
});

//================================fim atividade 6 =================================================

app.listen(8080, () => console.log("Servidor iniciado"));
