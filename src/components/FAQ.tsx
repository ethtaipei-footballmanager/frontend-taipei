import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function FAQ() {
  return (
    <div className="flex justify-center bg-gray-200 items-center min-h-screen">
      <Card className="shadow-lg w-[550px]">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold tracking-tighter">
            Frequently Asked Questions
          </h2>
          <Accordion className="w-full mt-4" type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline font-semibold tracking-tight">
                How to play Super Leo Lig?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                You can play Super Leo Lig on Aleo with Puzzle Wallet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:no-underline font-semibold tracking-tight">
                How many players can play?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                Two players can play against each other after selecting their
                teams and entering the wagers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:no-underline font-semibold tracking-tight">
                Is there special tournaments to play in?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                Season long and special tournaments are in the roadmap.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline font-semibold tracking-tight">
                Can i play this game on Ethereum or any other EVM chain?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                Currently we are only on Aleo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="border-b-0" value="item-5">
              <AccordionTrigger className="hover:no-underline font-semibold tracking-tight">
                Will there be a trade market for players like NFTs?
              </AccordionTrigger>
              <AccordionContent className="text-black/80">
                Yes, this is our goal for future versions of the game. To have a
                market players can trade their players. Special prizes for
                players who are at the top of the leaderboard.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
