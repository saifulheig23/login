import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();


  const handleForgotPassword = async(e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // console.log(email);
    const toastId = toast.loading("Sending email...");

   try {
     const res = await forgotPassword({email});
 
     if (res?.data?.success) {
       toast.success(res?.data?.message, { id: toastId });
     } else {
       toast.error(res?.error?.data?.message, { id: toastId });
      }

   } catch (error) {
    toast.error(error?.data?.message, { id: toastId });
   }
  };

  return (
    <>
      <section className="lg:max-w-7xl h-[85vh] mx-auto  flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm shadow-2xl">
        <form onSubmit={handleForgotPassword}>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Enter yoour email</Label>
              <Input
                className="text-lg  "
                name="email"
                type="text"
                placeholder="Your email here"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-gradient">
              Send
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
    </>
  );
};

export default ForgotPassword;