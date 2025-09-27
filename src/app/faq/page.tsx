"use client";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What types of digital products do you offer?",
    answer: "Fiyova offers a wide range of premium digital products including software tools, digital templates, design assets, e-books, courses, and other downloadable content. All products are carefully curated to ensure high quality and value for our customers."
  },
  {
    question: "How does the one-time purchase model work?",
    answer: "Unlike subscription services, Fiyova operates on a simple one-time purchase model. You pay once and own the product forever. There are no recurring fees, no monthly charges, and no surprise bills. Once purchased, the product is yours to use indefinitely."
  },
  {
    question: "How do I download my purchased products?",
    answer: "After completing your purchase, you'll receive an email confirmation with download links to your products. You can access your files immediately after payment confirmation. All download links remain active, so you can re-download your products anytime."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure payment processor. All transactions are encrypted and processed securely to protect your financial information."
  },
  {
    question: "Are there any refunds available?",
    answer: "Due to the digital nature of our products and instant access upon purchase, all sales are final and non-refundable. We encourage you to review product descriptions, previews, and specifications carefully before making a purchase."
  },
  {
    question: "Can I use the products for commercial purposes?",
    answer: "Usage rights vary by product and are specified in each product's description and license terms. Some products include commercial licenses, while others are for personal use only. Please review the license information before purchasing."
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes! We provide customer support for technical issues, download problems, and general inquiries. While we don't offer refunds, we're committed to helping you successfully access and use your purchased products."
  },
  {
    question: "What if I lose my download links?",
    answer: "No problem! Contact our support team with your order information, and we'll help you retrieve your download links. We recommend saving your purchase confirmation emails and bookmarking download pages for future reference."
  },
  {
    question: "Are the products updated or maintained?",
    answer: "Product updates depend on the individual creator and product type. Some products receive regular updates, which are typically provided free to existing customers. Check product descriptions for information about updates and maintenance."
  },
  {
    question: "Is my personal information secure?",
    answer: "Absolutely. We take privacy and security seriously. Your personal information is encrypted, securely stored, and never shared with third parties without your consent. We comply with industry-standard security practices and data protection regulations."
  },
  {
    question: "Can I purchase products as gifts?",
    answer: "Currently, our system processes purchases for the buyer's immediate access. For gift purchases, you can buy the product and then share the download information with the recipient, ensuring they have access to the purchased content."
  },
  {
    question: "What file formats are available?",
    answer: "File formats vary by product type and are clearly specified in each product description. Common formats include PDF, ZIP archives, executable files, source code, and various media formats. Check individual product pages for specific format information."
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-default-500">
            Find answers to common questions about Fiyova and our digital products.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-default-50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-left font-medium text-foreground">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`size-5 text-default-400 transition-transform ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>
              {openItems.includes(index) && (
                <CardBody className="pt-0 pb-6">
                  <p className="text-default-600 leading-relaxed">
                    {item.answer}
                  </p>
                </CardBody>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-xl bg-default-100 p-8">
            <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-default-600 mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="text-sm text-default-500">
              <p>Contact us for assistance with your digital product purchases.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}