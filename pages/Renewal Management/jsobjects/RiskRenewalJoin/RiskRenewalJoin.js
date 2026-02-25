export default {

  // Hauptfunktion: Joined Data aus beiden Queries
  getJoinedData() {
    const riskData = RiskData.data || [];
    const renewalData = RenewalData.data || [];

    // Index der Risk-Daten nach opp_id
    const riskByOppId = {};
    riskData.forEach(risk => {
      riskByOppId[risk.opp_id] = risk;
    });

    // JOIN: Renewal LEFT JOIN Risk
    const joined = renewalData.map(renewal => {
      const risk = riskByOppId[renewal.opportunity_id] || {};
      const hasRisk = !!risk.opp_id;

      const renewalOutcome = renewal.final_outcome;
      const outcomeCategory = this.deriveOutcomeCategory(renewalOutcome);

      // Risk-Status bereinigen
      let effectiveRiskStatus = risk.current_risk_status || null;
      if (effectiveRiskStatus === 'Closed Won') {
        if (outcomeCategory === 'renewed') {
          effectiveRiskStatus = 'Recovered (' + renewalOutcome + ')';
        } else if (outcomeCategory === 'not_renewed') {
          effectiveRiskStatus = 'Renewal lost (Closed Won was incorrect)';
        } else {
          effectiveRiskStatus = 'Closed Won (pending verification)';
        }
      } else if (effectiveRiskStatus === 'At Risk' && outcomeCategory === 'renewed') {
        effectiveRiskStatus = 'Recovered (' + renewalOutcome + ') - missing Closed Won';
      }

      // Recovery-Berechnung
      let daysToRecovery = null;
      let recoveryDate = null;
      let recoverySource = null;

      if (hasRisk && risk.first_at_risk_timestamp) {
        const firstRisk = new Date(risk.first_at_risk_timestamp);

        if (risk.recovery_timestamp) {
          recoveryDate = risk.recovery_timestamp;
          recoverySource = 'risk_closed_won';
          daysToRecovery = Math.round(
            (new Date(risk.recovery_timestamp) - firstRisk) / (1000 * 60 * 60 * 24)
          );
        } else if (outcomeCategory === 'renewed' && renewal.renewed_booking_date) {
          recoveryDate = renewal.renewed_booking_date;
          recoverySource = 'renewal_booking_date_fallback';
          daysToRecovery = Math.round(
            (new Date(renewal.renewed_booking_date) - firstRisk) / (1000 * 60 * 60 * 24)
          );
        }
      }

      return {
        // Account Info
        account_id:             renewal.account_id,
        account_name:           renewal.account_name,
        account_owner:          renewal.account_owner,
        team_lead:              renewal.team_lead,
        booking_amount:         renewal.booking_amount,
        product_type:           renewal.product_type,
        product_type_merged:    renewal.product_type_merged,
        gtm_motion:             renewal.account_owner_gtm_motion,

        // Risk Info
        is_at_risk:             hasRisk,
        first_at_risk:          risk.first_at_risk_timestamp || null,
        risk_status_raw:        risk.current_risk_status || null,
        risk_status_effective:  effectiveRiskStatus,
        risk_label:             risk.current_risk_label || null,
        initial_risk_label:     risk.initial_risk_label || null,
        risk_description:       risk.latest_risk_description || null,
        initial_risk_description: risk.initial_risk_description || null,
        risk_submitted_by:      risk.latest_submit_user || null,
        total_risk_updates:     risk.total_risk_updates || 0,

        // Outcome
        final_outcome:          renewalOutcome,
        outcome_category:       outcomeCategory,
        recovery_amount:        renewal.recovery_amount,
        renewed_booking_date:   renewal.renewed_booking_date,

        // Recovery Metriken
        recovery_date:          recoveryDate,
        recovery_source:        recoverySource,
        days_to_recovery:       daysToRecovery,

        // Kontext
        contract_start_date:    renewal.contract_start_date,
        contract_expired_date:  renewal.contract_expired_date,
        renewable_quarter:      renewal.renewable_quarter,
        opportunity_stage:      renewal.opportunity_stage,
        days_until_expiration:  renewal.days_until_expiration,
        opportunity_id:         renewal.opportunity_id
      };
    });

    return joined;
  },

  // Hilfsfunktion: Outcome-Kategorie ableiten
  deriveOutcomeCategory(renewalOutcome) {
    if (!renewalOutcome) return 'pending';
    switch (renewalOutcome.toLowerCase()) {
      case 'not_renewed':     return 'not_renewed';
      case 'early renewal':   return 'renewed';
      case 'late renewal':    return 'renewed';
      case 'renew in time':   return 'renewed';
      default:                return renewalOutcome;
    }
  },

  // ============================================================================
  // FILTER-FUNKTIONEN (für Widgets nutzbar)
  // ============================================================================

  // Nur Opportunities die jemals at risk waren
  getAtRiskOnly() {
    return this.getJoinedData().filter(row => row.is_at_risk);
  },

  // Nur aktuell at risk (nicht recovered, nicht lost)
  getCurrentlyAtRisk() {
    return this.getJoinedData().filter(row =>
      row.risk_status_raw === 'At Risk' && row.outcome_category !== 'renewed'
    );
  },

  // Recovered: waren at risk, jetzt renewed
  getRecovered() {
    return this.getJoinedData().filter(row =>
      row.is_at_risk && row.outcome_category === 'renewed'
    );
  },

  // Lost: waren at risk, nicht renewed
  getLost() {
    return this.getJoinedData().filter(row =>
      row.is_at_risk && row.outcome_category === 'not_renewed'
    );
  },

  // ============================================================================
  // SUMMARY STATS (für Stat-Widgets / Dashboard)
  // ============================================================================

  getSummaryStats() {
    const data = this.getJoinedData();
    const atRisk = data.filter(r => r.is_at_risk);
    const recovered = atRisk.filter(r => r.outcome_category === 'renewed');
    const lost = atRisk.filter(r => r.outcome_category === 'not_renewed');
    const pending = atRisk.filter(r => r.outcome_category === 'pending');

    const recoveryDays = recovered
      .filter(r => r.days_to_recovery !== null)
      .map(r => r.days_to_recovery);

    const avgRecoveryDays = recoveryDays.length > 0
      ? Math.round(recoveryDays.reduce((a, b) => a + b, 0) / recoveryDays.length)
      : null;

    const totalAtRiskAmount = atRisk.reduce((sum, r) => sum + (r.booking_amount || 0), 0);
    const totalRecoveredAmount = recovered.reduce((sum, r) => sum + (r.recovery_amount || 0), 0);
    const totalLostAmount = lost.reduce((sum, r) => sum + (r.booking_amount || 0), 0);

    return {
      total_renewals:         data.length,
      total_at_risk:          atRisk.length,
      total_recovered:        recovered.length,
      total_lost:             lost.length,
      total_pending:          pending.length,
      recovery_rate_pct:      atRisk.length > 0
        ? Math.round((recovered.length / atRisk.length) * 100)
        : 0,
      avg_days_to_recovery:   avgRecoveryDays,
      total_at_risk_amount:   totalAtRiskAmount,
      total_recovered_amount: totalRecoveredAmount,
      total_lost_amount:      totalLostAmount
    };
  }
};