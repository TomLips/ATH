// Bitcoin Indicators Dashboard - Versión Corregida
// Desarrollado por: Tom Lips & VipTrader
(function() {
    'use strict';

    class BitcoinDashboard {
        constructor(containerId) {
            this.btcATH = 69000; // Valor inicial (se actualizará)
            this.updateInterval = 35 * 60 * 1000;
            this.instanceId = 'btc-' + Math.random().toString(36).substr(2, 5);
            this.containerId = containerId;
            this.init();
        }

        createStyles() {
            const styles = `
                #${this.containerId} {
                    font-family: Arial, sans-serif;
                    width: 100%;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    margin: 10px 0;
                }
                /* ... (mantén aquí todos tus estilos originales) ... */
            `;
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        createHTML() {
            const container = document.getElementById(this.containerId);
            if (!container) return;

            container.innerHTML = `
                <div class="btc-widget">
                    <div class="btc-container">
                        <div class="btc-chart">
                            <div class="btc-chart-label">ATH</div>
                            <div class="btc-bar-container">
                                <div class="btc-bar" id="ath-bar"></div>
                            </div>
                            <div class="btc-info" id="ath-info">Máximo: $${this.btcATH.toLocaleString()}</div>
                        </div>
                        <!-- ... (mantén el resto de tu HTML original) ... -->
                    </div>
                </div>
            `;
        }

        async fetchData() {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
                const data = await response.json();
                const currentPrice = data.bitcoin.usd;

                // Actualizar ATH si es superado
                if (currentPrice > this.btcATH) {
                    this.btcATH = currentPrice;
                    const athInfo = document.getElementById('ath-info');
                    if (athInfo) athInfo.textContent = `Máximo: $${this.btcATH.toLocaleString()}`;
                }

                // Actualizar precio actual y demás lógica...
                console.log('Datos actualizados correctamente');

            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        }

        init() {
            this.createStyles();
            this.createHTML();
            this.fetchData();
            setInterval(() => this.fetchData(), this.updateInterval);
        }
    }

    // Inicialización automática
    if (document.getElementById('ATH')) {
        new BitcoinDashboard('ATH');
    }
})();
