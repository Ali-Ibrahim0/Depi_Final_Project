import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Subscription() {
  const [currentUser, setCurrentUser] = useState(null);
  const [subscription, setSubscription] = useState({ plan: 'basic', startDate: new Date().toISOString() });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      window.showNotification('Please login first.', 'error');
      navigate('/login', { replace: true });
      return;
    }
    setCurrentUser(user);

    const saved = JSON.parse(localStorage.getItem('subscription') || '{}');
    if (saved.plan) {
      setSubscription(saved);
    }
  }, [navigate]);

  const selectPlan = (plan) => {
    const newSub = { plan, startDate: new Date().toISOString() };
    setSubscription(newSub);
    localStorage.setItem('subscription', JSON.stringify(newSub));
    window.showNotification(`تم الترقية بنجاح إلى خطة ${getPlanName(plan)}!`, 'success');
  };

  const upgradePlan = () => {
    const next = subscription.plan === 'basic' ? 'pro' : 'enterprise';
    selectPlan(next);
  };


  const getPlanName = (plan) => {
    return { basic: 'Basic', pro: 'Pro', enterprise: 'Enterprise' }[plan];
  };

  const getPrice = (plan) => {
    return { basic: '$0', pro: '$29', enterprise: '$99' }[plan];
  };

  const getDetails = (plan) => {
    return {
      basic: 'Free plan - Up to 10 employees',
      pro: 'Pro plan - Up to 100 employees with advanced features',
      enterprise: 'Enterprise plan - Unlimited employees & custom features'
    }[plan];
  };

  if (!currentUser) return null;

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$0',
      features: ['Up to 10 employees', 'Basic reporting', 'Email support']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      features: ['Up to 100 employees', 'Advanced reporting', 'Priority support', 'Integrations'],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      features: ['Unlimited employees', 'Custom reporting', '24/7 support', 'Custom integrations']
    }
  ];

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-center text-white">Choose Your Plan</h2>

        {/* Plans */}
        <div className="row g-4 justify-content-center">
          {plans.map(plan => (
            <div key={plan.id} className="col-md-4">
              {/* البطاقة كلها يجب أن تكون h-100 */}
              <div className={`card shadow-sm plan-card h-100 ${plan.recommended ? 'recommended border-primary border-3' : ''}`}>
                {}
                <div className="card-body text-center position-relative d-flex flex-column">
                  {plan.recommended && (
                    <div className="recommended-badge">Most Popular</div>
                  )}
                  <h3 className="plan-name text-white">{plan.name}</h3>
                  <div className="price text-gold">{plan.price}<span className="period text-white-50">/month</span></div>
                  <ul className="plan-features mt-4 text-start text-white">
                    {plan.features.map((f, i) => (
                      <li key={i}>✓ {f}</li>
                    ))}
                  </ul>
                  <button
                    className={`btn w-100 mt-4 ${subscription.plan === plan.id ? 'btn-success' : plan.recommended ? 'btn-primary' : 'btn-outline-primary'} mt-auto`}
                    
                    onClick={() => selectPlan(plan.id)}
                    disabled={subscription.plan === plan.id}
                  >
                    {subscription.plan === plan.id ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Plan */}
        <div className="card shadow-sm mt-5 bg-dark border-gold">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Current Plan</h3>
            <div className="row align-items-center">
              <div className="col-md-8">
                <h4 className="text-gold">{getPlanName(subscription.plan)}</h4>
                <p className="text-white-50">{getDetails(subscription.plan)}</p>
              </div>
              <div className="col-md-4 text-end">
                {subscription.plan !== 'enterprise' ? (
                  <button className="btn btn-primary btn-lg" onClick={upgradePlan}>
                    Upgrade Plan
                  </button>
                ) : (
                  <button className="btn btn-success btn-lg" disabled>
                    Enterprise Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}