"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Divide, Loader2 } from "lucide-react";
import CustomInput from "./CustomInput";
import { authFormSchema, US_STATES } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";
import { toast } from "sonner";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatepicker";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setisLoading(true);

    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          email: data.email,
          password: data.password,
          ssn: data.ssn!,
          dateOfBirth: data.dateOfBirth!,
        };

        const newUser = await signUp(userData);
        setUser(newUser);
        toast.success("Account created successfully");
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          toast.success("Signed in successfully");
          router.push("/");
        }
      }
    } catch (error) {
      handleError(error);
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) =>
        toast.error(`${issue.path.join(".")}: ${issue.message}`)
      );
      return;
    }

    if (!(error instanceof Error)) {
      toast.error("An unexpected error occurred. Please try again later.");
      return;
    }

    const errorMessages: Record<string, string> = {
      EMAIL_EXISTS:
        "This email is already in use. Please use a different email or sign in.",
      INVALID_CREDENTIALS:
        "Invalid email or password. Please check your credentials and try again.",
      USER_NOT_FOUND:
        "User not found. Please check your email or sign up for a new account.",
      ERROR_CREATING_USER:
        "There was an error creating your account. Please try again.",
      ERROR_CREATING_DWOLLA_CUSTOMER:
        "There was an error setting up your payment information. Please try again.",
    };

    if (error.message in errorMessages) {
      toast.error(errorMessages[error.message]);
    } else if (error.message.startsWith("DWOLLA_VALIDATION_ERROR:")) {
      toast.error(
        `There was an error with your information: ${error.message.replace(
          "DWOLLA_VALIDATION_ERROR:",
          ""
        )}`
      );
    } else if (
      error.message.startsWith("DWOLLA_ERROR:") ||
      error.message.startsWith("APPWRITE_ERROR:")
    ) {
      toast.error(
        `There was an error setting up your account: ${error.message}`
      );
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <section className="auth-form ">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1 flex">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Hassan Logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Hassan Banking
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-26 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" ? (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name={"firstName"}
                      label={"First Name"}
                      placeholder={"ex: Hassan"}
                      type="text"
                    />
                    <CustomInput
                      control={form.control}
                      name={"lastName"}
                      label={"Last Name"}
                      placeholder={"ex: Alti"}
                      type="text"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name={"address1"}
                    label={"Address"}
                    placeholder={"Enter your specific address"}
                    type="text"
                  />
                  <CustomInput
                    control={form.control}
                    name={"city"}
                    label={"City"}
                    placeholder={"Enter your city"}
                    type="text"
                  />

                  <div className="flex gap-4">
                    <CustomSelect
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Select a state"
                      options={US_STATES}
                    />
                    <CustomInput
                      control={form.control}
                      name={"postalCode"}
                      label={"Postal Code"}
                      placeholder={"ex: 11011"}
                      type="text"
                    />{" "}
                  </div>

                  <div className="flex gap-4">
                    <CustomDatePicker
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="yyyy-mm-dd"
                    />
                    <CustomInput
                      control={form.control}
                      name={"ssn"}
                      label={"SSN"}
                      placeholder={"ex: 1234"}
                      type="text"
                    />
                  </div>
                </>
              ) : (
                <></>
              )}

              <CustomInput
                control={form.control}
                name={"email"}
                label={"Email"}
                placeholder={"Enter your email"}
                type="text"
              />
              <CustomInput
                control={form.control}
                name={"password"}
                label={"Password"}
                placeholder={"Enter your password"}
                type="password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin"></Loader2>{" "}
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-noral text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};
export default AuthForm;
