
import { Check, Crown } from "lucide-react";
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

  return (
    <Card className={`relative glass-morphism border-white/20 transition-all duration-300 hover:scale-105 ${
      plan.is_popular ? 'ring-2 ring-primary/50' : ''
    } ${isCurrentPlan ? 'ring-2 ring-green-500/50 bg-green-500/5' : ''}`}>
      {plan.is_popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 luxury-gradient text-white">
          Most Popular
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 right-4 bg-green-500 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Your Plan
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold luxury-gradient-text">{plan.name}</CardTitle>
        <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-foreground">${displayPrice}</span>
          <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
          {billingCycle === 'yearly' && savings > 0 && (
            <div className="text-sm text-green-400 font-medium">Save {savings}%</div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={`w-full ${isCurrentPlan ? 'bg-green-500 hover:bg-green-600' : 'luxury-button'} text-white font-semibold`}
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
