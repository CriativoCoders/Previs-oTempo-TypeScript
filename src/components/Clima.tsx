import { useState } from "react";
import axios from "axios";

interface WeatherResponse {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
    last_updated: string;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
}

export function Clima() {
  const [inputCidade, setInputCidade] = useState("");
  const [cidade, setCidade] = useState("");
  const [pais, setPais] = useState("");
  const [temperatura, setTemperatura] = useState<number | null>(null);
  const [umidade, setUmidade] = useState<number | null>(null);
  const [vento, setVento] = useState<number | null>(null);
  const [sensacaoTermica, setSensacaoTermica] = useState<number | null>(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
  const [dataAtual, setDataAtual] = useState("");
  const [iconeTempo, setIconeTempo] = useState("");
  const [textoCondicao, setTextoCondicao] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function buscarClima() {
    if (!inputCidade.trim()) {
      setErro("Digite uma cidade válida, ex: São Paulo ou São Paulo, BR");
      return;
    }

    setErro("");
    setLoading(true);

    // Passa input direto, exemplo: "São Paulo" ou "São Paulo, BR"
    const query = inputCidade.trim();

    try {
      const apiKey = "fc2c647c711146eea24162001252907";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
        query
      )}&lang=pt`;

      const resposta = await axios.get<WeatherResponse>(url);

      // DEBUG: verifique a resposta no console
      console.log("Resposta da API:", resposta.data);

      setCidade(resposta.data.location.name);
      setPais(resposta.data.location.country);
      setTemperatura(resposta.data.current.temp_c);
      setUmidade(resposta.data.current.humidity);
      setVento(resposta.data.current.wind_kph);
      setSensacaoTermica(resposta.data.current.feelslike_c);
      setUltimaAtualizacao(resposta.data.current.last_updated);
      setIconeTempo(`https:${resposta.data.current.condition.icon}`);
      setTextoCondicao(resposta.data.current.condition.text);

      const agora = new Date();
      setDataAtual(
        agora.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Erro ao buscar clima:", error);
      setErro("Cidade não encontrada ou erro na busca.");
      setCidade("");
      setPais("");
      setTemperatura(null);
      setUmidade(null);
      setVento(null);
      setSensacaoTermica(null);
      setUltimaAtualizacao("");
      setIconeTempo("");
      setTextoCondicao("");
      setDataAtual("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>Clima Atual</h2>

      <input
        type="text"
        placeholder="Digite a cidade ou cidade, país (ex: São Paulo, BR)"
        value={inputCidade}
        onChange={(e) => setInputCidade(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") buscarClima();
        }}
        style={{ width: "100%", padding: 10, fontSize: 16, boxSizing: "border-box" }}
        disabled={loading}
      />

      <button
        onClick={buscarClima}
        style={{
          marginTop: 10,
          width: "100%",
          padding: 10,
          fontSize: 16,
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {erro && <p style={{ color: "red", marginTop: 10 }}>{erro}</p>}

      {temperatura !== null && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            borderRadius: 8,
            backgroundColor: "#f0f0f0",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: "bold" }}>
            📍 {cidade} - {pais}
          </p>

          {iconeTempo && (
            <img
              src={iconeTempo}
              alt={textoCondicao}
              style={{ width: 64, height: 64, marginBottom: 10 }}
            />
          )}

          <p style={{ fontSize: 16, margin: 0, fontWeight: "bold" }}>{textoCondicao}</p>

          <p>🌡️ Temperatura: {temperatura} °C</p>
          <p>🥵 Sensação térmica: {sensacaoTermica} °C</p>
          <p>💧 Umidade: {umidade}%</p>
          <p>💨 Vento: {vento} km/h</p>
          <p>🕑 Última atualização: {ultimaAtualizacao}</p>
          <p>📅 Data/hora local: {dataAtual}</p>
        </div>
      )}
    </div>
  );
}
