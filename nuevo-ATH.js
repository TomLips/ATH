// Bitcoin Indicators Dashboard - Versión Aislada para Blog
// Desarrollado por: Tom Lips & VipTrader

(function() {
    'use strict';

    class BitcoinDashboard {
        constructor(containerId) {
            this.btcATH = 111814.00; // Valor inicial (se actualizará si se supera)
            this.updateInterval = 35 * 60 * 1000;
            this.instanceId = Math.random().toString(36).substr(2, 9);
            this.containerId = containerId;
            this.init();
        }

        async fetchData() {
            try {
                // Obtener precio actual de Bitcoin
                const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
                const btcData = await btcResponse.json();
                const btcPrice = btcData.bitcoin.usd;
                const btcChange24h = btcData.bitcoin.usd_24h_change;

                // ====== ACTUALIZACIÓN DEL ATH (CORRECCIÓN) ======
                if (btcPrice > this.btcATH) {
                    this.btcATH = btcPrice;
                    // Actualizar el texto del ATH en el HTML
                    const athInfo = document.querySelector(`#${this.containerId} .btc-chart:first-child .btc-info`);
                    if (athInfo) athInfo.textContent = `Máximo: $${this.btcATH.toLocaleString()}`;
                }

                // Resto de la lógica original (sin cambios)
                const bchResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd&include_24hr_change=true');
                const bchData = await bchResponse.json();
                const bchChange24h = bchData['bitcoin-cash'].usd_24h_change;

                const adjustmentFactor = bchChange24h >= 0 ? 3 : 2;
                const adjustedChange = bchChange24h / adjustmentFactor;
                const forecastPrice = btcPrice * (1 + adjustedChange / 100);

                const minPrice = 60000;
                const maxPrice = 120000;
                const range = maxPrice - minPrice;

                const athHeight = Math.min(Math.max(((this.btcATH - minPrice) / range) * 100, 5), 95);
                const priceHeight = Math.min(Math.max(((btcPrice - minPrice) / range) * 100, 5), 95);
                const forecastHeight = Math.min(Math.max(((forecastPrice - minPrice) / range) * 100, 5), 95);

                const athBar = document.getElementById(`ath-bar-${this.instanceId}`);
                const priceBar = document.getElementById(`price-bar-${this.instanceId}`);
                const forecastBar = document.getElementById(`forecast-bar-${this.instanceId}`);

                if (athBar) athBar.style.height = `${athHeight}%`;
                if (priceBar) priceBar.style.height = `${priceHeight}%`;
                if (forecastBar) {
                    forecastBar.style.height = `${forecastHeight}%`;
                    forecastBar.className = `btc-bar ${adjustedChange >= 0 ? '' : 'red'}`;
                }

                const priceInfo = document.getElementById(`price-info-${this.instanceId}`);
                if (priceInfo) {
                    priceInfo.innerHTML = `$${btcPrice.toLocaleString()}<br><small>${btcChange24h >= 0 ? '+' : ''}${btcChange24h.toFixed(2)}%</small>`;
                }

                let analysis = '';
                const priceVsATH = (btcPrice / this.btcATH) * 100;
                const trend = adjustedChange >= 0 ? 'alcista' : 'bajista';
                
                if (priceVsATH > 90) {
                    analysis = `Bitcoin está cerca del ATH (${priceVsATH.toFixed(1)}%). Tendencia ${trend} en el corto plazo.`;
                } else if (priceVsATH > 70) {
                    analysis = `Bitcoin en zona intermedia (${priceVsATH.toFixed(1)}% del ATH). Señal ${trend} según nuestro indicador.`;
                } else {
                    analysis = `Bitcoin lejos del ATH (${priceVsATH.toFixed(1)}%). Tendencia ${trend} - ${trend === 'alcista' ? 'posible recuperación' : 'precaución'}.`;
                }

                const summary = document.getElementById(`summary-${this.instanceId}`);
                if (summary) summary.textContent = `📊 ${analysis}`;

                const now = new Date();
                const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                const nextUpdate = new Date(now.getTime() + this.updateInterval);
                const nextStr = nextUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                
                const updateInfo = document.getElementById(`update-${this.instanceId}`);
                if (updateInfo) {
                    updateInfo.textContent = `🕒 Actualizado: ${timeStr} | Próximo: ${nextStr}`;
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                const summary = document.getElementById(`summary-${this.instanceId}`);
                if (summary) summary.textContent = '❌ Error al cargar datos. Reintentando...';
            }
        }

        // ====== MÉTODOS SIN CAMBIOS ======
        createStyles() { /* ... */ }
        createHTML() { /* ... */ }
        init() { /* ... */ }
        setup() { /* ... */ }
    }

    // Auto-inicialización (sin cambios)
    function initWidget() {
        const container = document.getElementById('ATH');
        if (container && !container.getAttribute('data-btc-initialized')) {
            container.setAttribute('data-btc-initialized', 'true');
            new BitcoinDashboard('ATH');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    window.BitcoinDashboard = BitcoinDashboard;
})();
