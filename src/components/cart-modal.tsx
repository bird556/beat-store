import { Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { useNavigate, useLocation } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  if (!isOpen) return null;
  return (
    <>
      <Modal
        placement="center"
        backdrop="blur"
        classNames={{
          backdrop: 'bg-background/20 !backdrop-opacity-10',

          closeButton:
            'right-1 top-2 z-[5000] hover:!text-white !text-gray-300',
        }}
        className="max-w-sm lg:max-w-3xl !overflow-auto max-h-4/6 md:!max-h-2/3"
        isOpen={isOpen}
        size={'3xl'}
        scrollBehavior={'inside'}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            },
          },
        }}
        onClose={onClose}
      >
        <ModalContent className=" flex flex-col relative z-50 w-full box-border outline-none mx-1 my-1 sm:mx-6 sm:my-16 !rounded-2xl shadow-small overflow-hidden max-w-3xl bg-zinc-900">
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1 !bg-white/10 text-xl font-bold text-center">
                    Select License
                  </ModalHeader> */}
              <div className="relative flex w-full items-center pt-3 pb-6 overflow-hidden border-b-2 border-foreground/5">
                <div className="">
                  <ModalHeader className="flex flex-col   !font-normal dark:text-foreground/70">
                    <p className="text-2xl font-bold text-white">
                      Shopping Cart
                    </p>
                  </ModalHeader>
                </div>
              </div>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ModalBody className="p-6 space-y-4 dark:text-gray-400">
                    Your cart is empty
                  </ModalBody>
                </div>
              ) : (
                <>
                  <ModalBody className="p-6 space-y-4 overflow-y-scroll">
                    {/* Cart Items */}
                    {items.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="dark:text-gray-400">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className=" overflow-hidden flex items-center space-x-4 bg-zinc-800 rounded-lg"
                          >
                            <img
                              className="h-24 aspect-square object-cover"
                              src={item.image}
                              alt={item.title}
                            />
                            <div className="flex-1 min-w-0 p-3">
                              <h3 className="text-white font-medium truncate">
                                {item.title}
                              </h3>
                              <p className="text-gray-400 text-sm truncate">
                                {item.artist} Type Beat
                              </p>
                              <p className="text-green-400 text-sm">
                                {item.license} License
                                {/* item license */}
                              </p>
                            </div>
                            <div className="text-white font-bold">
                              ${item.price}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter className="z-50 !w-full block">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-white">
                        Total: ${totalPrice.toFixed(2)}
                      </span>
                      <button
                        onClick={clearCart}
                        className="text-red-400 hover:text-red-300 transition-colors text-sm"
                      >
                        Clear Cart
                      </button>
                    </div>
                    <div className="flex w-full gap-6">
                      <button
                        onClick={() => {
                          onClose();
                          if (location.pathname != '/') {
                            navigate('/beats');
                          }
                        }}
                        className="w-full !border-2 !border-white/10 hover:!border-white/50 px-6 py-2 !text-gray-300  transition-colors disabled:cursor-not-allowed dark:hover:!border-white/80 dark:hover:!text-white"
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/checkout');
                          return;
                        }}
                        className="w-full px-6 py-2 !bg-green-700 text-background dark:text-foreground font-medium rounded hover:!bg-green-600 transition-colors  disabled:cursor-not-allowed"
                      >
                        Checkout
                      </button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
