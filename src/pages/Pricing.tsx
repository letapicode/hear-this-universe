
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Check, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <div className="huly-glass p-12 rounded-3xl text-center animate-pulse">
          <div className="huly-gradient w-16 h-16 rounded-full mx-auto mb-6 animate-glow"></div>
          <div className="text-2xl font-medium huly-gradient-text">Loading pricing...</div>
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
            className="huly-glass border-white/20 hover:bg-white/10 text-foreground mr-6 px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="huly-gradient p-4 rounded-3xl inline-block mb-6 animate-glow">
            <Zap className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold huly-gradient-text mb-6">
            Choose Your Audio Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Unlock premium audiobooks, exclusive content, and enhanced features. 
            Start your journey to unlimited listening today.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}>
            <TabsList className="huly-glass border-white/20 p-1 h-14">
              <TabsTrigger 
                value="monthly" 
                className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-8 py-3 text-lg font-medium"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="yearly" 
                className="data-[state=active]:huly-gradient data-[state=active]:text-white data-[state=active]:border-0 px-8 py-3 text-lg font-medium relative"
              >
                Yearly
                <Badge className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5">
                  Save 17%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
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

        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-8 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-400" />
              <span>No hidden fees</span>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold huly-gradient-text mb-8">
            What's Included
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Check className="w-6 h-6" />, title: "Cross-platform sync", desc: "Listen anywhere, anytime" },
              { icon: <Zap className="w-6 h-6" />, title: "Offline downloads", desc: "Save for offline listening" },
              { icon: <Star className="w-6 h-6" />, title: "Premium content", desc: "Exclusive audiobooks" },
              { icon: <Shield className="w-6 h-6" />, title: "Ad-free experience", desc: "Uninterrupted listening" }
            ].map((feature, index) => (
              <div key={index} className="huly-glass border-white/20 p-6 rounded-xl hover:huly-shadow-hover transition-all duration-300">
                <div className="huly-gradient p-3 rounded-xl w-fit mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <div className="text-lg font-medium text-foreground mb-2">{feature.title}</div>
                <div className="text-muted-foreground text-sm">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
