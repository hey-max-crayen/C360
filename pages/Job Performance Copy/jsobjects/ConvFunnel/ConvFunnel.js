export default {
  options() {
    const selectedData = snowplow_jobsDetails.data?.[0] || {};
    
    const colors = {
      success: '#22c55e',    // Grün für Conversion
      dropoff: '#ef4444',    // Rot für Drop-off
      neutral: '#f5f5f5'     // Grau für 0-Werte
    };
    
    // Berechne Conversion Rates
    const funnelSteps = [
      {
        name: 'Impressions → Page Views',
        total: selectedData.impressions || 0,
        converted: selectedData.total_pageviews || 0
      },
      {
        name: 'Page Views → App Started',
        total: selectedData.total_pageviews || 0,
        converted: selectedData.app_start || 0
      },
      {
        name: 'App Started → App Submitted',
        total: selectedData.app_start || 0,
        converted: selectedData.app_submit || 0
      },
      {
        name: 'App Submitted → App Sent',
        total: selectedData.app_submit || 0,
        converted: selectedData.app_sent || 0
      },
      {
        name: 'App Sent → Gold Apps',
        total: selectedData.app_sent || 0,
        converted: selectedData.gold_app || 0
      },
      {
        name: 'Gold Apps → Hires',
        total: selectedData.gold_app || 0,
        converted: selectedData.total_hires || 0
      }
    ];

    const chartData = funnelSteps.map(step => {
      const conversionRate = step.total > 0 ? (step.converted / step.total) * 100 : 0;
      const dropoffRate = 100 - conversionRate;
      
      return {
        name: step.name,
        conversion: conversionRate,
        dropoff: dropoffRate,
        absoluteNumbers: `${step.converted.toLocaleString()} / ${step.total.toLocaleString()}`,
        total: step.total,
        converted: step.converted
      };
    });

    return {
      backgroundColor: '#ffffff',
      grid: {
        left: '40%',
        right: '20%',
        top: '5%',
        bottom: '5%',
        containLabel: false
      },
      xAxis: {
        type: 'value',
        show: false,
        max: 100,
        min: 0
      },
      yAxis: {
        type: 'category',
        data: chartData.map(item => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          color: '#333333',
          fontWeight: '500',
          margin: 15,
          width: 150,
          overflow: 'truncate'
        },
        inverse: true
      },
      series: [
        // Conversion (grün)
        {
          name: 'Conversion',
          type: 'bar',
          stack: 'total',
          data: chartData.map((item, index) => ({
            value: item.conversion,
            itemStyle: {
              color: item.conversion > 0 ? colors.success : colors.neutral
            },
            // Speichere die Daten direkt im data object
            conversionRate: item.conversion,
            absoluteNumbers: item.absoluteNumbers,
            total: item.total,
            converted: item.converted
          })),
          barHeight: 28
        },
        // Drop-off (rot)
        {
          name: 'Drop-off',
          type: 'bar',
          stack: 'total',
          data: chartData.map((item, index) => ({
            value: item.dropoff,
            itemStyle: {
              color: item.dropoff > 0 ? colors.dropoff : colors.neutral
            },
            // Speichere die Daten direkt im data object
            conversionRate: item.conversion,
            absoluteNumbers: item.absoluteNumbers,
            total: item.total,
            converted: item.converted
          })),
          barHeight: 28,
          label: {
            show: true,
            position: 'right',
            formatter: function(params) {
              // Jetzt können wir direkt auf die Daten im params.data zugreifen
              const conversionRate = params.data.conversionRate || 0;
              const absoluteNumbers = params.data.absoluteNumbers || '';
              return `${conversionRate.toFixed(1)}% (${absoluteNumbers})`;
            },
            fontSize: 11,
            fontWeight: '600',
            color: '#333333',
            padding: [0, 0, 0, 8]
          }
        }
      ]
    };
  }
};
