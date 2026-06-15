import { insurancePricingPresentation } from "./insurance-plan-table.data";
import styles from "./insurance-plan-table.module.scss";

export const InsurancePlanTable = () => {
  return (
    <main className={styles.pricingPage}>
      <div className={styles.shell}>
        <section className={styles.hero} aria-labelledby="pricing-title">
          <div>
            <span className={styles.eyebrow}>Insurance pricing</span>
            <h1 className={styles.heroTitle} id="pricing-title">
              Coverage that feels clear before life gets expensive.
            </h1>
          </div>

          <div>
            <p className={styles.heroSubtitle}>
              Compare benefits, limits, and pricing side by side. Each row highlights the strongest
              value so customers can spot better protection, lower friction, and smarter monthly
              spend at a glance.
            </p>
            <ul className={styles.heroHighlights}>
              <li>Value-forward comparison with row-by-row winners</li>
              <li>Recommended plan based on coverage-to-price balance</li>
              <li>Responsive layout built for mobile and desktop review</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="plan-cards-title">
          <h2 className={styles.visuallyHidden} id="plan-cards-title">
            Plan summary cards
          </h2>

          <div className={styles.planGrid}>
            {insurancePricingPresentation.planCards.map((plan) => (
              <article
                className={[
                  styles.planCard,
                  styles[`planCard${plan.accent.charAt(0).toUpperCase()}${plan.accent.slice(1)}`],
                  plan.isRecommended ? styles.recommendedCard : "",
                ].join(" ")}
                key={plan.name}
              >
                <header className={styles.planHeader}>
                  <div className={styles.planName}>
                    <span
                      aria-hidden="true"
                      className={[styles.planTone, styles[`${plan.accent}Tone`]].join(" ")}
                    />
                    {plan.name}
                  </div>

                  {plan.isRecommended ? (
                    <span className={styles.recommendedBadge}>Recommended</span>
                  ) : null}
                </header>

                <div className={styles.priceBlock}>
                  <div className={styles.priceValue}>{plan.monthlyPrice}</div>
                  <div className={styles.priceSuffix}>per month</div>
                </div>

                <p className={styles.summary}>{plan.summary}</p>

                {plan.explanation ? <p className={styles.explanation}>{plan.explanation}</p> : null}

                <ul className={styles.statsList}>
                  {plan.stats.map((stat) => (
                    <li key={stat.label}>
                      <span>{stat.label}</span>
                      <span className={styles.statValue}>{stat.value}</span>
                    </li>
                  ))}
                </ul>

                <ul className={styles.featureList}>
                  {plan.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="comparison-title"
          className={styles.comparisonSection}
          id="compare-plans"
        >
          <div className={styles.comparisonHeader}>
            <h2 className={styles.comparisonTitle} id="comparison-title">
              Compare benefits in detail
            </h2>
            <p className={styles.comparisonSubtitle}>
              The highlighted values mark the strongest offer in each row. Higher limits win for
              coverage metrics, while lower copay and waiting periods win for customer cost and
              access.
            </p>
          </div>

          <div className={styles.desktopTable}>
            <table className={styles.table}>
              <caption className={styles.visuallyHidden}>
                Insurance plan comparison table. Recommended plan:{" "}
                {insurancePricingPresentation.recommendedPlanName}.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Benefit</th>
                  {insurancePricingPresentation.planCards.map((plan) => (
                    <th key={plan.name} scope="col">
                      <div className={styles.planColumnHeading}>
                        <span className={styles.planColumnName}>{plan.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {insurancePricingPresentation.comparisonSections.map((section) => (
                <tbody key={section.title}>
                  <tr className={styles.sectionRow}>
                    <td colSpan={4}>{section.title}</td>
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={row.id}>
                      <th className={styles.metricLabelCell} scope="row">
                        <span className={styles.metricName}>{row.label}</span>
                        {row.description ? (
                          <span className={styles.metricDescription}>{row.description}</span>
                        ) : null}
                      </th>
                      {row.values.map((value) => (
                        <td className={styles.metricValueCell} key={`${row.id}-${value.planName}`}>
                          <div
                            className={[
                              styles.metricValueCard,
                              value.isBest ? styles.bestValue : "",
                              value.isMissing ? styles.missingValue : "",
                            ].join(" ")}
                          >
                            <span className={styles.valueText}>{value.displayValue}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>

          <div className={styles.mobileComparison}>
            {insurancePricingPresentation.comparisonSections.map((section) => (
              <section className={styles.mobileSection} key={section.title}>
                <h3 className={styles.mobileSectionTitle}>{section.title}</h3>
                {section.rows.map((row) => (
                  <article className={styles.mobileMetric} key={row.id}>
                    <div className={styles.mobileMetricHeader}>
                      <h4 className={styles.mobileMetricName}>{row.label}</h4>
                      {row.description ? (
                        <p className={styles.mobileMetricDescription}>{row.description}</p>
                      ) : null}
                    </div>

                    <div className={styles.mobileMetricValues}>
                      {row.values.map((value) => (
                        <div
                          className={[
                            styles.mobileValueCard,
                            value.isBest ? styles.bestValue : "",
                            value.isMissing ? styles.missingValue : "",
                          ].join(" ")}
                          key={`${row.id}-${value.planName}-mobile`}
                        >
                          <div className={styles.mobileValueIdentity}>
                            <span className={styles.mobilePlanName}>{value.planName}</span>
                            <span className={styles.mobilePlanMeta}>
                              {value.isBest ? "Best in row" : "Included in comparison"}
                            </span>
                          </div>
                          <span className={styles.mobileValueText}>{value.displayValue}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
