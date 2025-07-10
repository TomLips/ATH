// Bitcoin Indicators Dashboard - Versión Aislada para Blog
// Desarrollado por: Tom Lips & VipTrader

(function() {
    'use strict';

    class BitcoinDashboard {
        constructor(containerId) {
            this.btcATH = 116.800.00;
            this.updateInterval = 35 * 60 * 1000;
            this.instanceId = Math.random().toString(36).substr(2, 9);
            this.containerId = containerId;
            this.init();
        }

        createStyles() {
            // Estilos completamente aislados con prefijo único
            const styles = `
                #${this.containerId} .btc-widget-${this.instanceId} {
                    font-family: Arial, sans-serif !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 15px !important;
                    box-sizing: border-box !important;
                    color: #333 !important;
                    background-color: #f8f9fa !important;
                    border: 1px solid #dee2e6 !important;
                    border-radius: 8px !important;
                    margin: 10px 0 !important;
                    position: relative !important;
                    overflow: hidden !important;
                    display: block !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-container {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: stretch !important;
                    gap: 10px !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-wrap: nowrap !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-chart {
                    flex: 1 !important;
                    text-align: center !important;
                    padding: 10px 5px !important;
                    margin: 0 !important;
                    min-width: 0 !important;
                    background: #ffffff !important;
                    border: 1px solid #e9ecef !important;
                    border-radius: 6px !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-chart-label {
                    font-size: 0.9rem !important;
                    font-weight: 600 !important;
                    margin-bottom: 8px !important;
                    color: #495057 !important;
                    border-bottom: 1px solid #dee2e6 !important;
                    padding-bottom: 5px !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-bar-container {
                    height: 150px !important;
                    position: relative !important;
                    margin: 10px 0 !important;
                    background: #f8f9fa !important;
                    border: 1px solid #e9ecef !important;
                    border-radius: 4px !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-bar {
                    position: absolute !important;
                    bottom: 5px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 40px !important;
                    background-color: #28a745 !important;
                    border-radius: 3px 3px 0 0 !important;
                    transition: height 0.8s ease !important;
                    min-height: 5px !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-bar.blue {
                    background-color: #007bff !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-bar.red {
                    background-color: #dc3545 !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-info {
                    font-size: 0.75rem !important;
                    color: #6c757d !important;
                    margin-top: 5px !important;
                    line-height: 1.2 !important;
                    word-wrap: break-word !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-summary {
                    margin-top: 15px !important;
                    padding: 12px !important;
                    background-color: #e7f3ff !important;
                    border: 1px solid #b8daff !important;
                    border-radius: 6px !important;
                    font-size: 0.85rem !important;
                    color: #004085 !important;
                    line-height: 1.4 !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-update {
                    margin-top: 10px !important;
                    font-size: 0.7rem !important;
                    color: #6c757d !important;
                    text-align: center !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-disclaimer {
                    margin-top: 10px !important;
                    padding: 8px !important;
                    background-color: #fff3cd !important;
                    border: 1px solid #ffeeba !important;
                    border-radius: 4px !important;
                    font-size: 0.7rem !important;
                    color: #856404 !important;
                    text-align: center !important;
                }
                
                #${this.containerId} .btc-widget-${this.instanceId} .btc-authors {
                    margin-top: 8px !important;
                    padding: 6px !important;
                    background-color: #d1ecf1 !important;
                    border: 1px solid #bee5eb !important;
                    border-radius: 4px !important;
                    font-size: 0.7rem !important;
                    color: #0c5460 !important;
                    text-align: center !important;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    #${this.containerId} .btc-widget-${this.instanceId} .btc-container {
                        flex-direction: column !important;
                        gap: 15px !important;
                    }
                    
                    #${this.containerId} .btc-widget-${this.instanceId} .btc-chart {
                        min-height: 180px !important;
                    }
                    
                    #${this.containerId} .btc-widget-${this.instanceId} .btc-bar-container {
                        height: 120px !important;
                    }
                    
                    #${this.containerId} .btc-widget-${this.instanceId} .btc-chart-label {
                        font-size: 0.8rem !important;
                    }
                }
            `;

            if (!document.getElementById(`btc-styles-${this.instanceId}`)) {
                const styleSheet = document.createElement('style');
                styleSheet.id = `btc-styles-${this.instanceId}`;
                styleSheet.textContent = styles;
                document.head.appendChild(styleSheet);
            }
        }

        createHTML() {
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Contenedor ${this.containerId} no encontrado`);
                return;
            }

            container.innerHTML = `
                <div class="btc-widget-${this.instanceId}">
                    <div class="btc-container">
                        <div class="btc-chart">
                            <div class="btc-chart-label">ATH (22 mayo)</div>
                            <div class="btc-bar-container">
                                <div class="btc-bar" id="ath-bar-${this.instanceId}"></div>
                            </div>
                            <div class="btc-info">Máximo: $${this.btcATH.toLocaleString()}</div>
                        </div>
                        
                        <div class="btc-chart">
                            <div class="btc-chart-label">BTC Hoy</div>
                            <div class="btc-bar-container">
                                <div class="btc-bar blue" id="price-bar-${this.instanceId}"></div>
                            </div>
                            <div class="btc-info" id="price-info-${this.instanceId}">Cargando...</div>
                        </div>
                        
                        <div class="btc-chart">
                            <div class="btc-chart-label">PREVISIÓN</div>
                            <div class="btc-bar-container">
                                <div class="btc-bar" id="forecast-bar-${this.instanceId}"></div>
                            </div>
                            <div class="btc-info">VipTrend-Bitcoin</div>
                        </div>
                    </div>
                    
                    <div class="btc-summary" id="summary-${this.instanceId}">
                        Cargando análisis...
                    </div>
                    
                    <div class="btc-update" id="update-${this.instanceId}">
                        Actualizando...
                    </div>
                    
                    <div class="btc-disclaimer">
                        ⚠️ Solo para fines educativos - No es consejo de inversión
                    </div>
                    
                    <div class="btc-authors">
                        💻 Desarrollado por: Tom Lips & VipTrader
                    </div>
                </div>
            `;
        }

        async fetchData() {
            try {
                // Obtener precio actual de Bitcoin
                const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
                const btcData = await btcResponse.json();
                const btcPrice = btcData.bitcoin.usd;
                const btcChange24h = btcData.bitcoin.usd_24h_change;

                // Obtener Bitcoin Cash para el indicador
                const bchResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd&include_24hr_change=true');
                const bchData = await bchResponse.json();
                const bchChange24h = bchData['bitcoin-cash'].usd_24h_change;

                // Calcular previsión
                const adjustmentFactor = bchChange24h >= 0 ? 3 : 2;
                const adjustedChange = bchChange24h / adjustmentFactor;
                const forecastPrice = btcPrice * (1 + adjustedChange / 100);

                // Calcular alturas de barras (normalizado entre 0-100%)
                const minPrice = 60000;
                const maxPrice = 120000;
                const range = maxPrice - minPrice;

                const athHeight = Math.min(Math.max(((this.btcATH - minPrice) / range) * 100, 5), 95);
                const priceHeight = Math.min(Math.max(((btcPrice - minPrice) / range) * 100, 5), 95);
                const forecastHeight = Math.min(Math.max(((forecastPrice - minPrice) / range) * 100, 5), 95);

                // Actualizar barras
                const athBar = document.getElementById(`ath-bar-${this.instanceId}`);
                const priceBar = document.getElementById(`price-bar-${this.instanceId}`);
                const forecastBar = document.getElementById(`forecast-bar-${this.instanceId}`);

                if (athBar) athBar.style.height = `${athHeight}%`;
                if (priceBar) priceBar.style.height = `${priceHeight}%`;
                if (forecastBar) {
                    forecastBar.style.height = `${forecastHeight}%`;
                    forecastBar.className = `btc-bar ${adjustedChange >= 0 ? '' : 'red'}`;
                }

                // Actualizar información
                const priceInfo = document.getElementById(`price-info-${this.instanceId}`);
                if (priceInfo) {
                    priceInfo.innerHTML = `$${btcPrice.toLocaleString()}<br><small>${btcChange24h >= 0 ? '+' : ''}${btcChange24h.toFixed(2)}%</small>`;
                }

                // Generar resumen
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

                // Actualizar tiempo
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

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            this.createStyles();
            this.createHTML();
            this.fetchData();
            setInterval(() => this.fetchData(), this.updateInterval);
        }
    }

    // Auto-inicialización
    function initWidget() {
        const container = document.getElementById('ATH');
        if (container && !container.getAttribute('data-btc-initialized')) {
            container.setAttribute('data-btc-initialized', 'true');
            new BitcoinDashboard('ATH');
        }
    }

    // Ejecutar cuando se carga el script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // Exportar para uso manual si es necesario
    window.BitcoinDashboard = BitcoinDashboard;

})();
