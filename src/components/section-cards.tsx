import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useOrders } from '@/contexts/OrdersContext';

export function SectionCards() {
  const { orders, isLoaded } = useOrders();
  if (!isLoaded) {
    return <div className="text-center">Loading...</div>;
  }

  const currentDate = new Date('2025-09-14T17:09:00-04:00'); // Set to current date (Sep 14, 2025)
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Total Revenue (YTD this year)
  const startThisYTD = new Date(currentYear, 0, 1);
  const totalRevenueThisYTD = orders
    .filter((o) => o.createdAt >= startThisYTD)
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // Last YTD
  const startLastYTD = new Date(currentYear - 1, 0, 1);
  const endLastYTD = new Date(
    currentYear - 1,
    currentMonth,
    currentDate.getDate()
  );
  const totalRevenueLastYTD = orders
    .filter((o) => o.createdAt >= startLastYTD && o.createdAt <= endLastYTD)
    .reduce((sum, o) => sum + o.totalPrice, 0);

  let revenuePercent = 0;
  if (totalRevenueLastYTD > 0) {
    revenuePercent =
      ((totalRevenueThisYTD - totalRevenueLastYTD) / totalRevenueLastYTD) * 100;
  } else if (totalRevenueThisYTD > 0) {
    revenuePercent = 100;
  }
  const revenueIsUp = revenuePercent >= 0;
  const revenueTrendIcon = revenueIsUp ? (
    <IconTrendingUp />
  ) : (
    <IconTrendingDown />
  );
  const revenueTrendText = revenueIsUp ? '+' : '-';
  const revenueAbsPercent = Math.abs(revenuePercent).toFixed(1);
  const revenueFooterTrendText = `Trending ${
    revenueIsUp ? 'up' : 'down'
  } this year`;

  // Total Customers (all time unique)
  const customerFirstPurchase = new Map<string, Date>();
  for (const order of orders) {
    const email = order.customerInfo.email.toLowerCase();
    if (
      !customerFirstPurchase.has(email) ||
      order.createdAt < customerFirstPurchase.get(email)!
    ) {
      customerFirstPurchase.set(email, order.createdAt);
    }
  }
  const totalCustomers = customerFirstPurchase.size;

  // New customers this month
  const startThisMonth = new Date(currentYear, currentMonth, 1);
  const endThisMonth = currentDate;
  const newCustomersThisMonth = Array.from(
    customerFirstPurchase.entries()
  ).filter(
    ([_, date]) => date >= startThisMonth && date <= endThisMonth
  ).length;

  // New customers last month
  let lastMonth = currentMonth - 1;
  let lastYear = currentYear;
  if (lastMonth < 0) {
    lastMonth = 11;
    lastYear--;
  }
  const startLastMonth = new Date(lastYear, lastMonth, 1);
  const endLastMonth = new Date(currentYear, currentMonth, 0);
  const newCustomersLastMonth = Array.from(
    customerFirstPurchase.entries()
  ).filter(
    ([_, date]) => date >= startLastMonth && date <= endLastMonth
  ).length;

  let customersPercent = 0;
  if (newCustomersLastMonth > 0) {
    customersPercent =
      ((newCustomersThisMonth - newCustomersLastMonth) /
        newCustomersLastMonth) *
      100;
  } else if (newCustomersThisMonth > 0) {
    customersPercent = 100;
  }
  const customersIsUp = customersPercent >= 0;
  const customersTrendIcon = customersIsUp ? (
    <IconTrendingUp />
  ) : (
    <IconTrendingDown />
  );
  const customersTrendText = customersIsUp ? '+' : '-';
  const customersAbsPercent = Math.abs(customersPercent).toFixed(1);
  const customersFooterTrendText = `${
    customersIsUp ? 'Up' : 'Down'
  } ${customersAbsPercent}% this period`;
  // Total Beats Revenue (this month)
  const beatsRevenueThisMonth = orders
    .filter((o) => {
      return (
        new Date(o.createdAt) >= startThisMonth &&
        new Date(o.createdAt) < currentDate
      );
    })
    .reduce((sum, o) => {
      return sum + o.totalPrice;
    }, 0);

  // Total Beats Revenue (last month)
  const beatsRevenueLastMonth = orders
    .filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= startLastMonth && orderDate < startThisMonth;
    })
    .reduce((sum, o) => sum + o.totalPrice, 0);

  let beatsPercent = 0;

  if (beatsRevenueLastMonth > 0) {
    beatsPercent =
      ((beatsRevenueThisMonth - beatsRevenueLastMonth) /
        beatsRevenueLastMonth) *
      100;
  } else if (beatsRevenueThisMonth > 0) {
    beatsPercent = 100;
  }
  const beatsIsUp = beatsPercent >= 0;
  const beatsTrendIcon = beatsIsUp ? <IconTrendingUp /> : <IconTrendingDown />;
  const beatsTrendText = beatsIsUp ? '+' : '-';
  const beatsAbsPercent = Math.abs(beatsPercent).toFixed(1);
  const beatsFooterTrendText = `Trending ${
    beatsIsUp ? 'up' : 'down'
  } from last month`;

  // Total Sample Pack Revenue (this month)
  const sampleRevenueThisMonth = orders
    .filter((o) => o.createdAt >= startThisMonth && o.createdAt <= endThisMonth)
    .reduce(
      (sum, o) =>
        sum + o.items.reduce((s, i) => s + (!i.beatId ? i.price : 0), 0),
      0
    );

  const sampleRevenueLastMonth = orders
    .filter((o) => o.createdAt >= startLastMonth && o.createdAt <= endLastMonth)
    .reduce(
      (sum, o) =>
        sum + o.items.reduce((s, i) => s + (!i.beatId ? i.price : 0), 0),
      0
    );

  let samplePercent = 0;
  if (sampleRevenueLastMonth > 0) {
    samplePercent =
      ((sampleRevenueThisMonth - sampleRevenueLastMonth) /
        sampleRevenueLastMonth) *
      100;
  } else if (sampleRevenueThisMonth > 0) {
    samplePercent = 100;
  }
  const sampleIsUp = samplePercent >= 0;
  const sampleTrendIcon = sampleIsUp ? (
    <IconTrendingUp />
  ) : (
    <IconTrendingDown />
  );
  const sampleTrendText = sampleIsUp ? '+' : '-';
  const sampleAbsPercent = Math.abs(samplePercent).toFixed(1);
  const sampleFooterTrendText = `Trending ${
    sampleIsUp ? 'up' : 'down'
  } from last month`;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRevenueThisYTD.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {revenueTrendIcon}
              {revenueTrendText}
              {revenueAbsPercent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {revenueFooterTrendText} {revenueTrendIcon}
          </div>
          <div className="text-muted-foreground">Year to date</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {customersTrendIcon}
              {customersTrendText}
              {customersAbsPercent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {customersFooterTrendText} {customersTrendIcon}
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Beats Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {beatsRevenueThisMonth.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {beatsTrendIcon}
              {beatsTrendText}
              {beatsAbsPercent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {beatsFooterTrendText} {beatsTrendIcon}
          </div>
          <div className="text-muted-foreground">This Month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sample Pack Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {sampleRevenueThisMonth.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {sampleTrendIcon}
              {sampleTrendText}
              {sampleAbsPercent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {sampleFooterTrendText} {sampleTrendIcon}
          </div>
          <div className="text-muted-foreground">This Month</div>
        </CardFooter>
      </Card>
    </div>
  );
}
