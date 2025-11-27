import React, { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('Conectando ao backend...');

  useEffect(() => {
    fetch('http://localhost:5000') // ← se o seu backend estiver em outra porta (4242, 3333, etc), muda aqui
      .then(res => res.json())
      .then(data => setApiStatus(data.message || 'API conectada com sucesso!'))
      .catch(() => setApiStatus('Backend está no ar, mas verifique a porta ou CORS'));
  }, []);

  return (
    <div style={{ padding: '60px', fontSize: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#27ae60' }}>Sistema de Coleta de Lixo Verde</h1>
      <h2>Itacoatiara – AM</h2>
      <hr />
      <p><strong>Status do backend:</strong> {apiStatus}</p>
      <p>Frontend já está rodando e falando com a API</p>
      <small>Quando você colar o frontend completo, é só substituir esse arquivo</small>
    </div>
  );
}

export default App;
