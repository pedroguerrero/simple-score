import * as React from 'react';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DialogContentText from '@mui/material/DialogContentText';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

let typingName;
let typingScore;

function App() {
  const [games, setGames] = React.useState(0);
  const [players, setPlayers] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const savedGames = localStorage.getItem('games');
    const savedPlayers = localStorage.getItem('players');

    if (savedGames && Number(savedGames)) {
      setGames(Number(savedGames));
    }

    if (savedPlayers) {
      const parsedPlayers = JSON.parse(savedPlayers);

      if (parsedPlayers.length) {
        setPlayers(parsedPlayers);
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  React.useEffect(() => {
    localStorage.setItem('games', games.toString());
  }, [games]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'¿Desea eliminar los datos del juego?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Se eliminaran todos los datos del juego.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          <Button
            onClick={() => {
              handleClose();
              setGames(0);
              setPlayers([]);
            }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                Jugadores{' '}
                <ButtonGroup variant="text" aria-label="text button group">
                  <Button
                    onClick={() => {
                      const updatedPlayers = [
                        ...players.map(({ name, scores }) => ({
                          name,
                          scores,
                        })),
                        {
                          name: `Jugador ${players.length + 1}`,
                          scores: Array(games).fill(0),
                        },
                      ];

                      setPlayers(updatedPlayers);
                    }}
                  >
                    <PersonAddIcon />
                  </Button>

                  <Button
                    onClick={() => {
                      setGames(games + 1);

                      const updatedPlayers = players.map(
                        ({ name, scores }) => ({
                          name,
                          scores: [...scores, 0],
                        })
                      );

                      setPlayers(updatedPlayers);
                    }}
                  >
                    <SportsEsportsIcon />
                  </Button>

                  <Button onClick={handleClickOpen}>
                    <DeleteIcon />
                  </Button>
                </ButtonGroup>
              </TableCell>

              {[...Array(games).keys()].map((c) => (
                <TableCell key={c}>{`Juego ${c + 1}`}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map(({ name, scores }, indexPlayer) => (
              <TableRow
                key={name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <TextField
                    defaultValue={name}
                    size="small"
                    variant="standard"
                    onChange={({ target: { value } }) => {
                      if (typingName) {
                        clearTimeout(typingName);
                      }

                      typingName = setTimeout(() => {
                        const updatedPlayers = [
                          ...players.slice(0, indexPlayer),
                          { name: value, scores },
                          ...players.slice(indexPlayer + 1),
                        ];

                        setPlayers(updatedPlayers);
                      }, 1000);
                    }}
                  />
                  ({scores.reduce((prev, curr) => prev + curr, 0)})
                </TableCell>

                {scores.map((s, indexScore) => (
                  <TableCell key={indexScore} align="left">
                    <TextField
                      defaultValue={s}
                      size="small"
                      variant="standard"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={({ target: { value } }) => {
                        if (typingScore) {
                          clearTimeout(typingScore);
                        }

                        typingScore = setTimeout(() => {
                          const playerNewScore = [...scores];
                          playerNewScore[indexScore] = Number(value);

                          const updatedPlayers = [
                            ...players.slice(0, indexPlayer),
                            {
                              name,
                              scores: playerNewScore,
                            },
                            ...players.slice(indexPlayer + 1),
                          ];

                          setPlayers(updatedPlayers);
                        }, 500);
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
