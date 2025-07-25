import { useCart } from '@/contexts/cart-context';
import { motion } from 'framer-motion';
import { Divider } from '@heroui/divider';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
const CartCheckOut = ({ size }) => {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  console.log(items);
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8 z-5 !min-h-3/4"
    >
      <h2 className={`${size} text-4xl font-bold text-start`}>Cart</h2>
      <div className="grid grid-cols-3 py-8 mx-auto">
        <div className="col-span-2 z-5">
          {/* Header */}
          <div
            className={`!z-5 grid grid-cols-10 gap-4 text-foreground text-sm font-medium  border-gray-800 pb-3 mb-4`}
          >
            <div className="!col-span-3 md:!col-span-1 !z-5">Title</div>
            <div className="hidden md:block md:col-span-1 col-end-1 !z-5"></div>
            <div className="hidden md:block md:col-span-2"></div>
            <div className="lg:block col-end-10">Price</div>

            {/* <div className="col-span-5 md:col-span-2 lg:col-span-2"></div> */}
          </div>
        </div>
        <Card className="">
          <CardHeader className="flex gap-3">
            <div className="flex justify-between w-full">
              <p className="text-2xl  text-default-500 font-bold">Item Total</p>
              <p className="text-2xl text-default-500 font-bold">
                ${totalPrice}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <p>Make beautiful websites regardless of your design experience.</p>
          </CardBody>
          <Divider />
          <CardFooter>
            <h2>Visit source code on GitHub.</h2>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default CartCheckOut;
