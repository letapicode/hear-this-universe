
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscriptionPlans, useUserSubscription, useCreateCheckout } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import PricingCard from "@/components/PricingCard";
import LuxuryParticles from "@/components/LuxuryParticles";
import { toast } from "sonner";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const { data: plans = [], isLoading: plansLoading } = useSubscriptionPlans();
  const { data: userSubscription } = useUserSubscription();
  const createCheckout = useCreateCheckout();

  const handleSubscribe = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      navigate("/auth");
      return;
    }

    try {
      const { url } = await createCheckout.mutateAsync({ planId, billingCycle });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Failed to create checkout session. Please try again.");
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <LuxuryParticles />
        <div className="glass-morphism p-12 rounded-3xl text-center animate-pulse">
          <div className="luxury-gradient w-16 h-16 rounded-full mx-auto mb-6 animate-glow"></div>
          <div className="text-2xl font-medium luxury-gradient-text">Loading pricing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LuxuryParticles />
      
      <div className="container mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="glass-morphism border-white/20 hover:bg-white/10 text-foreground mr-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="luxury-gradient p-4 rounded-3xl inline-block mb-6 animate-glow">
            <Zap className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold luxury-gradient-text mb-6">
            Upgrade Your Audio Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your listening needs. Unlock premium content, 
            high-quality audio, and exclusive features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}>
            <TabsList className="glass-morphism border-white/20">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-primary/20">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="data-[state=active]:bg-primary/20">
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save up to 17%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onSubscribe={handleSubscribe}
              isCurrentPlan={userSubscription?.subscription_plans?.id === plan.id && userSubscription?.subscribed}
              isLoading={createCheckout.isPending}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold luxury-gradient-text mb-8">
            All Plans Include
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              "Cross-platform access",
              "Sleep timer",
              "Bookmarks & favorites",
              "Progress sync"
            ].map((feature, index) => (
              <div key={index} className="glass-morphism border-white/20 p-6 rounded-xl">
                <div className="text-lg font-medium text-foreground">{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
