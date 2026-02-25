export default {
  options() {
    const performanceLevel = Job_List.selectedRow?.scores_complexity_v2 || 0;
    const isEmpty = performanceLevel === 0;
    const gaugeValue = performanceLevel > 0 ? 10 + ((performanceLevel - 1) * 20) : 0;

    const getPerformanceLabel = (level) => {
      const labels = {
    1: 'Schwach',
    2: 'Mäßig', 
    3: 'Okay',
    4: 'Gut',
    5: 'Top'
      };
      return labels[level] || '';
    };        
    return {
      title: {
        text: 'Job Performance',
        left: 'center',
        top: 'top',
        textStyle: {
          fontSize: 18,
          fontWeight: 'normal',
          color: '#333'
        }
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          axisLine: {
            lineStyle: {
              width: 15,
              color: isEmpty
                ? [[1, '#e0e0e0']]
                : [
                    [0.2, '#ea4335'],
                    [0.4, '#ff9800'],
                    [0.6, '#fbbc04'],
                    [0.8, '#8bc34a'],
                    [1, '#22b31e']
                  ]
            }
          },
          pointer: {
            itemStyle: {
              color: isEmpty ? '#e0e0e0' : 'auto'
            }
          },
          axisTick: {
            show: false,
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            show: false,
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            show: false,
            color: 'inherit',
            distance: 40,
            fontSize: 20
          },
          detail: {
            valueAnimation: true,
            formatter: isEmpty ? '' : `${performanceLevel}\n${getPerformanceLabel(performanceLevel)}`,
            color: isEmpty ? '#e0e0e0' : 'inherit',
            fontSize: 14,
            fontWeight: 'bold'
          },
          data: [
            {
              value: gaugeValue
            }
          ]
        }
      ]
    };
  },
};
