const fakeChessPublisher = {
  id: 1,
  name: 'Chess publisher',
};

const fakeChess = {
  id: 1,
  name: 'Chess',
  slug: 'chess',
  subtitle: 'Best game ever',
  description: 'Long time ago Lorem ipsum',
  age_restriction: { from: 5, to: null },
  players_number: { from: 2, to: 2 },
  publisher: fakeChessPublisher,
  photos: [],
};

fakeChessPublisher.boardgames = [fakeChess];

const fakeGo = {
  id: 2,
  name: 'Go',
  slug: 'go',
  subtitle: 'Second Best game ever',
  description: 'Long time ago Lorem ipsum',
  age_restriction: { from: 5, to: null },
  players_number: { from: 2, to: 2 },
  photos: [],
};

const fakeBoardGames = [
  fakeChess,
  fakeGo,
];

const root = {
  boardgames: args =>
    fakeBoardGames.filter(
      elm => (
        (!args.search || elm.name.indexOf(args.search) !== -1) &&
        (!args.ids || args.ids.indexOf(elm.id) !== -1)
      ),
    ),
  publishers: () => [fakeChessPublisher],
};
export default root;
