// "use client";

// import { Game } from "@/app/state/gameStore";

// interface IYourTurn {
//   game: Game;
// }

// const YourTurn: React.FC<IYourTurn> = ({ game }) => {
//   const user = game.gameNotification.recordData.owner;
//   const opponent_address = game.gameNotification.recordData.opponent_address;
//   const challenger_address =
//     game.gameNotification.recordData.challenger_address;
//   const vs = user === opponent_address ? challenger_address : opponent_address;
//   const wager = game.gameNotification.recordData.total_pot / 2;
//   const renderActionButton = () => {
//     switch (game.gameAction) {
//       case "Submit Wager":
//         return <SubmitWagerButton game={game} />;
//       case "Accept":
//         return <AcceptGameButton game={game} />;
//       case "Reveal":
//         return (
//           <Button
//             onClick={() => {
//               setCurrentGame(game);
//               navigate(
//                 `/reveal-answer/${game.gameNotification.recordData.game_multisig}`
//               );
//             }}
//             size="sm"
//             color="yellow"
//           >
//             Reveal
//           </Button>
//         );
//       case "Lose":
//         return (
//           <Button
//             onClick={() => {
//               setCurrentGame(game);
//               navigate(
//                 `/finish-game/lose/${game.gameNotification.recordData.game_multisig}`
//               );
//             }}
//             size="sm"
//             color="yellow"
//           >
//             See Answer
//           </Button>
//         );
//       case "Claim":
//         return (
//           <Button
//             onClick={() => {
//               setCurrentGame(game);
//               navigate(
//                 `/finish-game/win/${game.gameNotification.recordData.game_multisig}`
//               );
//             }}
//             color="yellow"
//             size="sm"
//           >
//             View Result
//           </Button>
//         );
//     }
//   };
//   return <div>YourTurn</div>;
// };
// export default YourTurn;
