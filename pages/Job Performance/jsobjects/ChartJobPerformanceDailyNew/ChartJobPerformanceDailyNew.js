export default {
  fetchData() {
    const data = snowplow_jobDetailsSelected.data || [];
    
    if (data.length === 0) {
      console.warn("Keine Daten verfügbar!");
      return { days: [], applicationsStarted: [], applicationsSent: [] };
    }

    const sortedData = data
      .filter(row => row.job_slot_days_live && row.job_slot_days_live <= 30)
      .sort((a, b) => a.job_slot_days_live - b.job_slot_days_live);

    const days = [];
    const applicationsStarted = [];
    const applicationsSent = [];
    
    for (let day = 1; day <= 30; day++) {
      const dayData = sortedData.find(row => row.job_slot_days_live === day);
      
      days.push(`Tag ${day}`);
      
      if (dayData) {
        const started = dayData.rt_applications_start || 0;
        const sent = dayData.rt_applications_sent || 0;
        const startedNotSent = Math.max(0, started - sent);
        
        applicationsStarted.push(startedNotSent);
        applicationsSent.push(sent);
      } else {
        applicationsStarted.push(0);
        applicationsSent.push(0);
      }
    }

    return { days, applicationsStarted, applicationsSent };
  },

  options() {
    const data = this.fetchData();
    
    return {
      title: {
        text: 'Performance Entwicklung',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Applications started', 'Applications sent'],
        top: 35
      },
      grid: {
        left: '8%',
        right: '8%',
        bottom: '15%', // Zurück auf 15% da kein DataZoom mehr
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.days,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          interval: 0,
          overflow: 'truncate'
        },
        axisTick: {
          alignWithLabel: true,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '',
        nameRotate: 90,
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '{value}',
          fontSize: 9
        },
        nameTextStyle: {
          fontSize: 12
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      series: [
        {
          name: 'Applications started',
          type: 'bar',
          stack: 'applications',
          data: data.applicationsStarted,
          itemStyle: {
            color: '#c84182',
            opacity: 1
          },
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: 'Applications sent',
          type: 'bar',
          stack: 'applications',
          data: data.applicationsSent,
          itemStyle: {
            color: '#e6af14',
            opacity: 1
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
  }
};
