import { useState } from 'react';

interface RentInput {
    currentRent: number;
    increasePercent: number;
    state: string;
    monthlyIncome: number;
}

const STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const RENT_TIPS: string[] = [
    'The 30% rule suggests rent should not exceed 30% of gross income',
    'Some states and cities have rent control or stabilization laws',
    'Review your lease terms for allowable increase caps',
    'Negotiate with your landlord before accepting increases'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;

function App() {
    const [values, setValues] = useState<RentInput>({ currentRent: 1800, increasePercent: 5, state: 'California', monthlyIncome: 6000 });
    const handleChange = (field: keyof RentInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    // Calculate rent increase
    const increaseAmount = Math.round(values.currentRent * (values.increasePercent / 100));
    const newRent = values.currentRent + increaseAmount;
    const annualIncrease = increaseAmount * 12;

    // Rent-to-income ratio
    const rentToIncomeRatio = values.monthlyIncome > 0 ? (newRent / values.monthlyIncome) * 100 : 0;

    // Affordability indicator
    let affordabilityStatus = 'Affordable';
    let affordabilityColor = '#16A34A';
    if (rentToIncomeRatio > 50) {
        affordabilityStatus = 'Severely Burdened';
        affordabilityColor = '#DC2626';
    } else if (rentToIncomeRatio > 30) {
        affordabilityStatus = 'Cost Burdened';
        affordabilityColor = '#D97706';
    }

    const breakdownData = [
        { label: 'Current Monthly Rent', value: fmt(values.currentRent), isTotal: false },
        { label: 'Monthly Increase', value: `+${fmt(increaseAmount)}`, isIncrease: true },
        { label: 'New Monthly Rent', value: fmt(newRent), isTotal: false },
        { label: 'Annual Impact', value: `+${fmt(annualIncrease)}`, isTotal: true, isIncrease: true },
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Rent Increase Impact Calculator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Estimate the financial impact of a rent increase</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="currentRent">Current Monthly Rent ($)</label>
                            <input id="currentRent" type="number" min="100" max="20000" step="50" value={values.currentRent || ''} onChange={(e) => handleChange('currentRent', parseInt(e.target.value) || 0)} placeholder="1800" />
                        </div>
                        <div>
                            <label htmlFor="increasePercent">Rent Increase (%)</label>
                            <input id="increasePercent" type="number" min="0" max="100" step="0.5" value={values.increasePercent || ''} onChange={(e) => handleChange('increasePercent', parseFloat(e.target.value) || 0)} placeholder="5" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="state">State</label>
                            <select id="state" value={values.state} onChange={(e) => handleChange('state', e.target.value)}>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="monthlyIncome">Monthly Gross Income ($)</label>
                            <input id="monthlyIncome" type="number" min="1000" max="100000" step="100" value={values.monthlyIncome || ''} onChange={(e) => handleChange('monthlyIncome', parseInt(e.target.value) || 0)} placeholder="6000" />
                        </div>
                    </div>
                    <button className="btn-primary" type="button">Calculate Impact</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>New Monthly Rent</h2>
                    <div className="result-hero">{fmt(newRent)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>+{pct(values.increasePercent)} from current</div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Monthly Increase</div>
                        <div className="result-value" style={{ color: '#DC2626' }}>+{fmt(increaseAmount)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Annual Cost</div>
                        <div className="result-value" style={{ color: '#DC2626' }}>+{fmt(annualIncrease)}</div>
                    </div>
                </div>
                <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', padding: 'var(--space-3)', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
                    <div className="result-label">Rent-to-Income Ratio</div>
                    <div className="result-value" style={{ color: affordabilityColor }}>{pct(rentToIncomeRatio)} ({affordabilityStatus})</div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Important Considerations</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {RENT_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Impact Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isIncrease ? '#DC2626' : (row.isTotal ? 'var(--color-primary)' : 'var(--color-text-primary)') }}>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator provides estimates of rent increase impacts based on the values entered. Actual rent increases depend on lease terms, local laws, and landlord policies. The figures shown are estimates only and do not constitute legal advice. Rent control and stabilization laws vary by location. Consult local tenant rights organizations or a legal professional for guidance specific to your situation.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Not legal advice</li><li>• Free to use</li>
                </ul>
                <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                    <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                    <span style={{ color: '#64748B' }}>|</span>
                    <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
                </nav>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Rent Increase Calculator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
