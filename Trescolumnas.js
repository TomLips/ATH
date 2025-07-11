// Bitcoin Indicators Dashboard - Complete JavaScript Version
// Desarrollado por: Tom Lips & VipTrader

class BitcoinDashboard {
    constructor(containerId = null) {
        this.btcATH = 111814.00; // ATH fijo del 22 mayo
        this.updateInterval = 35 * 60 * 1000; // 35 minutos
        this.instanceId = Math.random().toString(36).substr(2, 9);
        this.containerId = containerId;
        this.init();
    }

    // Crear los estilos CSS
    createStyles() {
        const styles = `
            .bitcoin-dashboard-widget {
                font-family: 'Arial', sans-serif;
                width: 100%;
                max-width: 100%;
                padding: 20px;
                box-sizing: border-box;
                color: #333;
                background-color: #f0f0f0;
                border-radius: 8px;
            }
            .bitcoin-dashboard-widget .container {
                display: flex;
                justify-content: center;
                width: 100%;
                margin: 0 auto;
                flex-wrap: wrap;
                gap: 10px;
            }
            .bitcoin-dashboard-widget .chart {
                text-align: center;
                padding: 0;
                margin: 0 1px;
                flex: 1;
                min-width: 45px;
                position: relative;
            }
            .bitcoin-dashboard-widget .chart-label {
                font-size: 1.1rem;
                margin-bottom: 5px;
                position: relative;
                font-weight: 500;
            }
            .bitcoin-dashboard-widget .chart-label::after {
                content: '';
                position: absolute;
                bottom: -3px;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: #bbb;
            }
            .bitcoin-dashboard-widget .bar-container {
                height: 280px;
                position: relative;
                border-left: 1px solid #bbb;
                border-bottom: 1px solid #bbb;
                width: 100%;
                display: flex;
                justify-content: center;
            }
            .bitcoin-dashboard-widget .bar {
                position: absolute;
                bottom: 0;
                width: 30%;
                left: 50%;
                transform: translateX(-50%);
                background-color: #00cc00;
                transition: height 0.5s ease;
                border-radius: 3px;
            }
            .bitcoin-dashboard-widget .bar.blue {
                background-color: #0066cc;
            }
            .bitcoin-dashboard-widget .y-axis {
                position: absolute;
                left: 0;
                width: 60px;
                text-align: left;
                font-size: 0.8rem;
                top: 0;
                height: 100%;
            }
            .bitcoin-dashboard-widget .y-axis span {
                display: block;
                height: 56px;
                line-height: 56px;
                white-space: nowrap;
            }
            .bitcoin-dashboard-widget .value {
                display: none;
            }
            .bitcoin-dashboard-widget .info {
                margin-top: 5px;
                font-size: 0.75rem;
                color: #555;
                white-space: nowrap;
            }
            .bitcoin-dashboard-widget .summary {
                margin-top: 15px;
                padding: 12px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 6px;
                text-align: left;
                font-size: 0.9rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .bitcoin-dashboard-widget .update-info {
                margin-top: 10px;
                font-size: 0.8rem;
                text-align: center;
                color: #666;
            }
            .bitcoin-dashboard-widget .disclaimer {
                margin-top: 10px;
                padding: 10px;
                background-color: #fff3e6;
                border: 1px solid #ffcc99;
                border-radius: 6px;
                font-size: 0.8rem;
                text-align: center;
                color: #744700;
            }
            .bitcoin-dashboard-widget .viptrend-info {
                margin-top: 10px;
                padding: 10px;
                background-color: #000;
                border: 1px solid #333;
                border-radius: 6px;
                font-size: 0.8rem;
                text-align: center;
                color: #fff;
                font-weight: normal;
            }
            .bitcoin-dashboard-widget .viptrend-info h3 {
                margin: 0 0 5px 0;
                font-size: 0.9rem;
                font-weight: 500;
                color: #ddd;
            }
            .bitcoin-dashboard-widget .authors {
                margin-top: 15px;
                padding: 10px;
                background-color: #e6f3ff;
                border: 1px solid #99ccff;
                border-radius: 6px;
                font-size: 0.8rem;
                text-align: center;
                color: #004d99;
            }
            @media (max-width: 600px) {
                .bitcoin-dashboard-widget .container {
                    flex-direction: column;
                    align-items: center;
                }
                .bitcoin-dashboard-widget .chart {
                    width: 100%;
                    max-width: 300px;
                    margin-bottom: 20px;
                }
                .bitcoin-dashboard-widget .bar-container {
                    height: 200px;
                }
                .bitcoin-dashboard-widget .y-axis {
                    width: 50px;
                    font-size: 0.7rem;
                }
                .bitcoin-dashboard-widget .y-axis span {
                    height: 40px;
                    line-height: 40px;
                }
                .bitcoin-dashboard-widget .chart-label {
                    font-size: 0.9rem;
                }
                .bitcoin-dashboard-widget .info {
                    font-size: 0.7rem;
                    white-space: normal;
                }
            }
        `;

        // Evitar duplicar estilos
        if (!document.getElementById(`bitcoin-dashboard-styles-${this.instanceId}`)) {
            const styleSheet = document.createElement('style');
            styleSheet.id = `bitcoin-dashboard-styles-${this.instanceId}`;
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    // Crear la estructura HTML
    createHTML(container) {
        container.innerHTML = `
            <div class="bitcoin-dashboard-widget">
                <div class="container">
                    <!-- Gráfico 1: Máximo Histórico (ATH) -->
                    <div class="chart">
                        <div class="chart-label">ATH (22 mayo)</div>
                        <div class="bar-container">
                            <div class="y-axis">
                                <span>$120,000</span>
                                <span>$110,000</span>
                                <span>$100,000</span>
                                <span>$90,000</span>
                                <span>$80,000</span>
                            </div>
                            <div class="bar" id="ath-bar-${this.instanceId}" style="height: 0%;"></div>
                            <div class="value" id="ath-value-${this.instanceId}">Cargando...</div>
                        </div>
                        <div class="info" id="ath-price-${this.instanceId}">Máximo Histórico: ${this.btcATH.toFixed(2)}</div>
                    </div>

                    <!-- Gráfico 2: Precio Actual de Bitcoin -->
                    <div class="chart">
                        <div class="chart-label">BTC Hoy</div>
                        <div class="bar-container">
                            <div class="bar blue" id="price-bar-${this.instanceId}" style="height: 0%;"></div>
                        </div>
                        <div class="info" id="btc-price-${this.instanceId}">Precio: Cargando...</div>
                    </div>

                    <!-- Gráfico 3: PREVISIÓN -->
                    <div class="chart">
                        <div class="chart-label">PREVISIÓN</div>
                        <div class="bar-container">
                            <div class="bar" id="combined-bar-${this.instanceId}" style="height: 0%;"></div>
                        </div>
                        <div class="info">Según indicador VipTrend-Bitcoin</div>
                    </div>
                </div>

                <!-- Resumen Comentado -->
                <div class="summary" id="summary-${this.instanceId}">Cargando resumen...</div>

                <!-- Información de actualización -->
                <div class="update-info" id="update-info-${this.instanceId}">Cargando información de actualización...</div>

                <!-- Descargo de Responsabilidad -->
                <div class="disclaimer">Descargo de Responsabilidad: Esto es un ejemplo educativo y nunca se tomará para trading ni inversiones</div>

                <!-- Información sobre VipTrend-Bitcoin -->
                <div class="viptrend-info">
                    <h3>Sobre VipTrend-Bitcoin</h3>
                    Nuestro indicador prevé los posibles movimientos alcistas o bajistas de Bitcoin calculando si se acerca o aleja del actual ATH de Bitcoin
                </div>

                <!-- Autores -->
                <div class="authors">
                    Desarrollado por: Tom Lips & VipTrader
                </div>
            </div>
        `;
    }

    // Función para obtener datos de Bitcoin y Bitcoin Cash
    async obtenerDatosCripto() {
        try {
            // Obtener datos históricos de Bitcoin para estimar YTD (365 días)
            const btcHistoryResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365');
            if (!btcHistoryResponse.ok) throw new Error('Error en API CoinGecko para historial BTC: ' + btcHistoryResponse.statusText);
            const btcHistoryData = await btcHistoryResponse.json();
            console.log('BTC History Data:', btcHistoryData);
            
            const prices = btcHistoryData.prices;
            const startPrice = prices[0][1];
            const currentPrice = prices[prices.length - 1][1];
            const btcYTD = ((currentPrice / startPrice) - 1) * 100;

            // Obtener datos actuales de Bitcoin (precio)
            const btcResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
            if (!btcResponse.ok) throw new Error('Error en API CoinGecko para Bitcoin: ' + btcResponse.statusText);
            const btcData = await btcResponse.json();
            console.log('BTC Data:', btcData);
            const btcPrice = btcData.market_data.current_price.usd;

            // Obtener datos de Bitcoin Cash (cambio porcentual 24h)
            const bchResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin-cash');
            if (!bchResponse.ok) throw new Error('Error en API CoinGecko para Bitcoin Cash: ' + bchResponse.statusText);
            const bchData = await bchResponse.json();
            console.log('BCH Data:', bchData);
            const bchChange24h = bchData.market_data.price_change_percentage_24h;

            // Calcular la previsión según la lógica original
            const adjustmentFactor = bchChange24h >= 0 ? 3 : 2;
            const adjustedBchChange = bchChange24h / adjustmentFactor;
            const combinedPrice = btcPrice + (adjustedBchChange / 100 * btcPrice);
            const combinedChange = adjustedBchChange;

            // Escalar las alturas de las barras según la escala ($80,000 a $120,000)
            const maxHeight = 280;
            const range = 40000; // $120,000 - $80,000
            const athBarHeight = Math.min(((this.btcATH - 80000) / range) * 100, 100);
            const priceBarHeight = Math.min(((btcPrice - 80000) / range) * 100, 100);
            const combinedBarHeight = Math.min(((combinedPrice - 80000) / range) * 100, 100);

            // Validar valores antes de actualizar
            if (isNaN(btcPrice) || isNaN(this.btcATH) || isNaN(combinedPrice)) {
                throw new Error('Valores inválidos en los datos: btcPrice, btcATH, o combinedPrice no son números.');
            }

            // Actualizar gráficos
            const athBar = document.getElementById(`ath-bar-${this.instanceId}`);
            const priceBar = document.getElementById(`price-bar-${this.instanceId}`);
            const combinedBar = document.getElementById(`combined-bar-${this.instanceId}`);
            const athValue = document.getElementById(`ath-value-${this.instanceId}`);
            const athPrice = document.getElementById(`ath-price-${this.instanceId}`);
            const btcPriceElement = document.getElementById(`btc-price-${this.instanceId}`);
            const summary = document.getElementById(`summary-${this.instanceId}`);
            const updateInfo = document.getElementById(`update-info-${this.instanceId}`);

            if (athBar) athBar.style.height = `${athBarHeight}%`;
            if (athValue) athValue.textContent = `${this.btcATH.toFixed(2)}`;
            if (athPrice) athPrice.textContent = `Máximo Histórico: ${this.btcATH.toFixed(2)}`;

            if (priceBar) priceBar.style.height = `${priceBarHeight}%`;
            if (btcPriceElement) btcPriceElement.textContent = `Precio: ${btcPrice.toFixed(2)}`;

            if (combinedBar) {
                combinedBar.style.height = `${combinedBarHeight}%`;
                combinedBar.style.backgroundColor = combinedChange >= 0 ? '#00cc00' : '#cc0000';
            }

            // Generar Resumen Comentado dinámico
            let summaryText = '';
            const priceVsATH = (btcPrice / this.btcATH) * 100;
            const isNearATH = priceVsATH > 90;
            const isAboveCurrent = combinedBarHeight > priceBarHeight;

            if (isNearATH) {
                if (isAboveCurrent) {
                    summaryText = 'El precio de Bitcoin está cerca de su máximo histórico (ATH). La previsión sugiere una tendencia al alza, con posibilidad de superar el ATH en el corto plazo.';
                } else {
                    summaryText = 'El precio de Bitcoin está cerca de su máximo histórico (ATH), pero la previsión indica resistencia, sugiriendo un posible retroceso o consolidación en el precio.';
                }
            } else {
                if (isAboveCurrent) {
                    summaryText = 'El precio de Bitcoin está lejos de su máximo histórico (ATH). La previsión muestra una tendencia al alza, indicando un posible acercamiento gradual al ATH.';
                } else {
                    summaryText = 'El precio de Bitcoin está lejos de su máximo histórico (ATH). La previsión sugiere un retroceso adicional en el precio a corto plazo.';
                }
            }

            if (summary) summary.textContent = `Resumen Comentado: ${summaryText}`;

            // Calcular y mostrar información de actualización
            const now = new Date();
            const lastUpdate = now.toLocaleTimeString('es-ES', { timeZone: 'CET', hour: '2-digit', minute: '2-digit' }) + ' CEST';
            const nextUpdate = new Date(now.getTime() + this.updateInterval).toLocaleTimeString('es-ES', { timeZone: 'CET', hour: '2-digit', minute: '2-digit' }) + ' CEST';
            if (updateInfo) updateInfo.textContent = `Actualiza cada 35 minutos | Última actualización: ${lastUpdate} | Próxima actualización: ${nextUpdate}`;

            console.log(`BTC Price: $${btcPrice}, BCH Change: ${bchChange24h}%, Adjusted: ${adjustedBchChange}%, Combined Price: $${combinedPrice.toFixed(2)}, Heights: ATH=${athBarHeight}%, BTC=${priceBarHeight}%, Combined=${combinedBarHeight}%`);

        } catch (error) {
            console.error('Error detallado:', error.message);
            const athValue = document.getElementById(`ath-value-${this.instanceId}`);
            const athPrice = document.getElementById(`ath-price-${this.instanceId}`);
            const btcPriceElement = document.getElementById(`btc-price-${this.instanceId}`);
            const summary = document.getElementById(`summary-${this.instanceId}`);
            const updateInfo = document.getElementById(`update-info-${this.instanceId}`);
            
            if (athValue) athValue.textContent = 'Error';
            if (athPrice) athPrice.textContent = 'Máximo Histórico: Error';
            if (btcPriceElement) btcPriceElement.textContent = 'Precio: Error';
            if (summary) summary.textContent = `Resumen Comentado: Error al cargar datos - ${error.message}`;
            if (updateInfo) updateInfo.textContent = 'Información de actualización: Error';
        }
    }

    // Inicializar el dashboard
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    }

    // Configurar el dashboard
    setup() {
        this.createStyles();
        
        // Determinar el contenedor
        let container;
        if (this.containerId) {
            container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Contenedor con ID '${this.containerId}' no encontrado`);
                return;
            }
        } else {
            // Si no se especifica contenedor, usar el body
            container = document.body;
        }
        
        this.createHTML(container);
        this.obtenerDatosCripto();
        setInterval(() => this.obtenerDatosCripto(), this.updateInterval);
    }
}

// Función para inicializar manualmente si se necesita
function initBitcoinDashboard(containerId = null) {
    return new BitcoinDashboard(containerId);
}

// Auto-inicializar cuando se carga el script
if (typeof window !== 'undefined') {
    // Exportar para uso manual
    window.BitcoinDashboard = BitcoinDashboard;
    window.initBitcoinDashboard = initBitcoinDashboard;
    
    // AUTO-INICIALIZAR: Buscar divs con id="ATH" y inicializar automáticamente
    document.addEventListener('DOMContentLoaded', function() {
        const athContainer = document.getElementById('ATH');
        if (athContainer && !athContainer.hasAttribute('data-bitcoin-dashboard-initialized')) {
            athContainer.setAttribute('data-bitcoin-dashboard-initialized', 'true');
            new BitcoinDashboard('ATH');
        }
    });
    
    // Si el DOM ya está cargado, ejecutar inmediatamente
    if (document.readyState !== 'loading') {
        const athContainer = document.getElementById('ATH');
        if (athContainer && !athContainer.hasAttribute('data-bitcoin-dashboard-initialized')) {
            athContainer.setAttribute('data-bitcoin-dashboard-initialized', 'true');
            new BitcoinDashboard('ATH');
        }
    }
}

// Para uso en Node.js (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BitcoinDashboard, initBitcoinDashboard };
}
