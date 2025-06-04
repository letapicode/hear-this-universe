
import { Check, Crown, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price_monthly: number;
    price_yearly: number;
    features: string[];
    is_popular: boolean;
  };
  billingCycle: 'monthly' | 'yearly';
  onSubscribe: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
}

const PricingCard = ({ plan, billingCycle, onSubscribe, isCurrentPlan, isLoading }: PricingCardProps) => {
  const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
  const displayPrice = (price / 100).toFixed(2);
  const savings = billingCycle === 'yearly' ? Math.round((1 - (plan.price_yearly / (plan.price_monthly * 12))) * 100) : 0;

  const getCardIcon = () => {
    if (plan.name.toLowerCase().includes('premium')) return <Star className="w-6 h-6" />;
    if (plan.name.toLowerCase().includes('pro')) return <Zap className="w-6 h-6" />;
    return <Crown className="w-6 h-6" />;
  };

  return (
    <Card className={`relative huly-glass border-white/20 transition-all duration-300 hover:scale-105 hover:huly-shadow-hover ${
      plan.is_popular ? 'ring-2 ring-primary/50 scale-105' : ''
    } ${isCurrentPlan ? 'ring-2 ring-green-500/50 bg-green-500/5' : ''}`}>
      {plan.is_popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="huly-gradient text-white px-4 py-1 text-sm font-semibold">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <Badge className="bg-green-500 text-white px-3 py-1">
            <Crown className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-8">
        <div className="mx-auto mb-4 huly-gradient p-3 rounded-2xl w-fit">
          {getCardIcon()}
        </div>
        <CardTitle className="text-2xl font-bold huly-gradient-text mb-2">{plan.name}</CardTitle>
        <CardDescription className="text-muted-foreground text-base">{plan.description}</CardDescription>
        
        <div className="mt-6">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold text-foreground">${displayPrice}</span>
            <span className="text-muted-foreground ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          {billingCycle === 'yearly' && savings > 0 && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Save {savings}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-6">
        <ul className="space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5">
                <Check className="h-3 w-3 text-green-400" />
              </div>
              <span className="text-foreground leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-6 px-6">
        <Button 
          className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-200 ${
            isCurrentPlan 
              ? 'bg-green-500 hover:bg-green-600 text-white border-0' 
              : plan.is_popular
                ? 'huly-gradient text-white border-0 hover:scale-105 huly-shadow'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
          }`}
          onClick={() => !isCurrentPlan && onSubscribe(plan.id, billingCycle)}
          disabled={isCurrentPlan || isLoading}
        >
          {isCurrentPlan ? 'Current Plan' : isLoading ? 'Processing...' : `Get ${plan.name}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
